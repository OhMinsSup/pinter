import * as React from 'react';
import * as classNames from 'classnames/bind';
import Spinner from '../../common/Spinner';
import SocialLoginButton from '../../base/SocialLoginButton';

const PlaneIcon = require('react-icons/lib/io/paper-airplane');
const CheckIcon = require('react-icons/lib/md/check');
const LogoIcons = require('react-icons/lib/fa/pinterest-square');
const styles = require('./AuthForm.scss');
const cx = classNames.bind(styles);

interface Props {
  email: string;
  sendEmail: boolean;
  isUser: boolean;
  sending: boolean;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
  onEnterKeyPress(e: React.KeyboardEvent<HTMLInputElement>): void;
  onSendVerification(): Promise<any>;
  onSocialLogin(provider: string): void;
}

const AuthForm: React.SFC<Props> = ({
  onChange,
  onEnterKeyPress,
  onSendVerification,
  onSocialLogin,
  sendEmail,
  isUser,
  email,
  sending,
}) => {
  return (
    <div className={cx('AuthForm')}>
      <div className={cx('FormHeader')}>
        <LogoIcons />
      </div>
      <div>
        <h3>Pinter에 오신 것을 환영 합니다.</h3>
      </div>
      {sendEmail ? (
        <div className={cx('SendEmail')}>
          <CheckIcon />
          <div className={cx('Text')}>
            {isUser ? '로그인' : '회원가입'} 링크가 이메일로 전송되었습니다.
            <br />
            이메일의 링크를 통하여 {isUser ? '로그인' : '회원가입'}을
            계속하세요.
          </div>
        </div>
      ) : (
        <div className={cx('InputWithButton')}>
          <input
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={onChange}
            onKeyPress={onEnterKeyPress}
          />
          <div className={cx('Button')} onClick={onSendVerification}>
            {sending ? <Spinner size="3rem" /> : <PlaneIcon />}
          </div>
        </div>
      )}
      <div className={cx('Separator')}>
        <div className={cx('or')}>OR</div>
      </div>
      <div className={cx('SocialButtons')}>
        <SocialLoginButton type="google" onSocialLogin={onSocialLogin} />
        <SocialLoginButton type="facebook" onSocialLogin={onSocialLogin} />
      </div>
    </div>
  );
};

export default AuthForm;
