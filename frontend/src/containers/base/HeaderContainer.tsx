import * as React from 'react';
import { Dispatch, bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { throttle } from 'lodash';
import { StoreState } from '../../store/modules';
import { userCreators } from '../../store/modules/user';
import Header from '../../components/base/Header';
import Storage from '../../lib/storage';
import { baseCreators } from '../../store/modules/base';
import { withRouter } from 'react-router';
import { noticeCreators } from '../../store/modules/notice';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type OwnProps = { location: Location };
type Props = StateProps & DispatchProps & OwnProps;

class HeaderContainer extends React.Component<Props> {
  public onResize = throttle(() => {
    const { BaseActions } = this.props;
    BaseActions.getbowserSize(document.body.scrollWidth);
  }, 250);

  public constructor(props: Props) {
    super(props);
    this.props.BaseActions.getbowserSize(document.body.scrollWidth);
  }

  public onSidebar = () => {
    const { BaseActions, visible } = this.props;
    visible ? BaseActions.setSidebar(false) : BaseActions.setSidebar(true);
  };

  public onNotice = () => {
    const { NoticeActions } = this.props;
    NoticeActions.noticeConfirm();
  };

  public onLogout = async () => {
    const { UserActions } = this.props;
    try {
      await UserActions.logout();
    } catch (e) {
      console.log(e);
    }
    Storage.remove('__pinter_user__');
    window.location.href = '/';
  };

  public componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  public render() {
    const { thumbnail, displayName, size, message } = this.props;
    const { onLogout, onSidebar, onNotice } = this;

    return (
      <Header
        thumbnail={thumbnail}
        displayName={displayName}
        onLogout={onLogout}
        onSidebar={onSidebar}
        onNotice={onNotice}
        count={message.length}
        size={size}
      />
    );
  }
}

const mapStateToProps = ({ user, base, notice }: StoreState) => ({
  visible: base.sidebar.visible,
  user: user.user && user.user,
  displayName: user.user && user.user.displayName,
  thumbnail: user.user && user.user.thumbnail,
  size: base.size,
  message: notice.messages,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  UserActions: bindActionCreators(userCreators, dispatch),
  BaseActions: bindActionCreators(baseCreators, dispatch),
  NoticeActions: bindActionCreators(noticeCreators, dispatch),
});

export default compose(
  withRouter,
  connect<StateProps, DispatchProps, OwnProps>(
    mapStateToProps,
    mapDispatchToProps
  )
)(HeaderContainer);
