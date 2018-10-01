import * as React from 'react';
import * as classNames from 'classnames/bind';
import PerfectScrollbar from 'perfect-scrollbar';
import ModalWrapper from '../../common/ModalWrapper';

const styles = require('./WriteSettingBox.scss');
const cx = classNames.bind(styles);

type Props = {
    open?: boolean,
    children: React.ReactNode,
}

class WriteSettingBox extends React.Component<Props> {
    public content: any = null;
    public ps: any = null;

    public setupScrollbar(): void {
        if (!this.content) return;
    
        if (this.ps) {
          this.ps.destroy();
          this.ps = null;
        }
    
        this.ps = new PerfectScrollbar(this.content);
        (window as any).ps = this.ps;
      }
    
    public initialize(): void {
        this.setupScrollbar();
    }
      
    public componentDidMount() {
        this.initialize();
    }
    
    public componentDidUpdate(prevProps: Props) {
        if (!prevProps.open && this.props.open) {
          this.initialize();
        }
        this.setupScrollbar();
    }

    public render() {
        const { children } = this.props;
        return (
        <ModalWrapper className={cx('write-setting-box')} open={true}>
            <h2>그룹 설정</h2>
            <div className={cx("content")} ref={(ref) => { this.content = ref; }}>
                {children}
            </div>
            <div className={cx("foot")}>
            <div className={cx("button", "cancel")} onClick={() => console.log('취소')}>
                취소
            </div>
            <div className={cx("button", "save")} onClick={() => console.log('저장')}>
                저장
            </div>
            </div>
        </ModalWrapper>
        )
    }
}

export default WriteSettingBox;