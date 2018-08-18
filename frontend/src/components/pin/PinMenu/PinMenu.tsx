import * as React from 'react';
import * as classNames from 'classnames/bind';
import PinMenuItem from '../PinMenuItem';

const styles  = require('./PinMenu.scss');
const cx = classNames.bind(styles);

type Props = {
    session_username: string | null,
    session_displayName: string | null,
    username: string,
    displayName: string,
    visible: boolean,
    onClick(): void
}

const PinMenu: React.SFC<Props> = ({ visible, onClick, session_username, session_displayName, username, displayName }) => {
    if (!visible) return null;
    return (
        <div className={cx('pin-menu-wrapper')}>
            <div className={cx('pin-menu-positioner')}>
                <div className={cx('pin-menu')}>
                    <div className={cx('menu-items')}>
                        {
                            (session_username === displayName) && (session_displayName && username) ? (
                                <React.Fragment>
                                    <PinMenuItem>
                                        태그
                                    </PinMenuItem>
                                    <PinMenuItem>
                                        수정
                                    </PinMenuItem>
                                    <PinMenuItem>
                                        삭제
                                    </PinMenuItem>
                                    <PinMenuItem>
                                        공유
                                    </PinMenuItem>
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <PinMenuItem>
                                        태그
                                    </PinMenuItem>
                                    <PinMenuItem>
                                        공유
                                    </PinMenuItem>
                                </React.Fragment>
                            )
                        }
                        <div className={cx('separator')}/>
                        <PinMenuItem onClick={onClick}>
                            메뉴 닫기
                        </PinMenuItem>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PinMenu;
