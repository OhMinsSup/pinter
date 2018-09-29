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

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type OwnProps = { location: Location };
type HeaderContainerProps = StateProps & DispatchProps & OwnProps;

class HeaderContainer extends React.Component<HeaderContainerProps> {
    public onResize = throttle(() => {
        const { BaseActions } = this.props;
        BaseActions.getbowserSize(document.body.scrollWidth);
    }, 250);
    
    public constructor(props: HeaderContainerProps) {
        super(props);
        this.props.BaseActions.getbowserSize(document.body.scrollWidth);
    } 

    public onSidebar = () => {
        const { BaseActions, visible } = this.props;
        visible ? BaseActions.setSidebar(false) : BaseActions.setSidebar(true);
    }

    public onLogout = async () => {
        const { UserActions } = this.props;
        try {
          await UserActions.logout();
        } catch (e) {
          console.log(e);
        }
        Storage.remove('__pinter_user__');
        window.location.href = '/';
    }

    public componentDidMount() {
        window.addEventListener('resize', this.onResize);
    }

    public render() {
        const { thumbnail, displayName, size } = this.props;
        const { onLogout, onSidebar } = this;
        
        return (
            <Header 
                thumbnail={thumbnail}
                displayName={displayName}
                onLogout={onLogout}
                onSidebar={onSidebar}
                size={size}
            />
        )
    }
}

const mapStateToProps = ({ user, base }: StoreState) => ({
    visible: base.sidebar.visible,
    user: user.user && user.user,
    displayName: user.user && user.user.displayName,
    thumbnail: user.user && user.user.thumbnail,
    size: base.size,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    UserActions: bindActionCreators(userCreators, dispatch),
    BaseActions: bindActionCreators(baseCreators, dispatch)
});

export default compose(
    withRouter, 
    connect<StateProps, DispatchProps, OwnProps>(
        mapStateToProps,
        mapDispatchToProps
    )
)(HeaderContainer);