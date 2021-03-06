import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { StoreState } from '../../store/modules';
import UserSettingProfile from '../../components/user/UserSettingProfile';
import UserSettingTemplate from '../../components/user/UserSettingTemplate';
import { baseCreators } from '../../store/modules/base';
import { commonCreators } from '../../store/modules/common';
import { writeCreators } from '../../store/modules/write';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

type UserProfileSettingProps = StateProps & DispatchProps;

class UserProfileSetting extends React.Component<UserProfileSettingProps> {
  public onCancel = () => {
    const { BaseActions } = this.props;
    BaseActions.setProfile(false);
  };

  public onChange = (e: any) => {
    const { CommonActions } = this.props;
    const { name, value } = e.target;

    CommonActions.changeInputProfile({
      name,
      value,
    });
  };

  public uploadImage = async (file: any) => {
    const { WriteActions } = this.props;

    try {
      await WriteActions.createUploadUrl(file);
    } catch (e) {
      console.log(e);
    }
  };

  public onUploadClick = () => {
    const upload = document.createElement('input');
    upload.type = 'file';
    upload.onchange = e => {
      if (!upload.files) return;
      const file = upload.files[0];
      this.uploadImage(file);
    };
    upload.click();
  };

  public render() {
    const { visible, profile } = this.props;
    const { onCancel, onChange, onUploadClick } = this;

    if (!visible) return null;

    return (
      <UserSettingTemplate>
        <UserSettingProfile
          thumbnail={profile.thumbnail}
          onCancel={onCancel}
          displayName={profile.displayName}
          onChange={onChange}
          onUploadClick={onUploadClick}
        />
      </UserSettingTemplate>
    );
  }
}

const mapStateToProps = ({ base, common }: StoreState) => ({
  visible: base.profile.visible,
  profile: common.setting,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  BaseActions: bindActionCreators(baseCreators, dispatch),
  CommonActions: bindActionCreators(commonCreators, dispatch),
  WriteActions: bindActionCreators(writeCreators, dispatch),
});

export default connect<StateProps, DispatchProps>(
  mapStateToProps,
  mapDispatchToProps
)(UserProfileSetting);
