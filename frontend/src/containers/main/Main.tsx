import * as React from 'react';
import MainTemplate from '../../components/main/MainTemplate';
import HeaderContainer from '../base/HeaderContainer';
import { StoreState } from '../../store/modules';
import { Dispatch, bindActionCreators } from 'redux';
import { baseCreators } from '../../store/modules/base';
import { connect } from 'react-redux';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type OwnProps = {
    path: string
}

type MainProps = OwnProps & StateProps & DispatchProps; 

class Main extends React.Component<MainProps> {
    public onOpenBox = () => {
        const { BaseActions } = this.props;
        BaseActions.openPinBox(true)
    }

    public render() {       
        const { path } = this.props; 
        const { onOpenBox } = this;
        return(
            <MainTemplate
                path={path}
                onClick={onOpenBox}
                header={<HeaderContainer />}
            >
                sdsds
            </MainTemplate>
        )
    }
}

const mapStateToProps = ({ base }: StoreState) => ({
    visible: base.pin.visible
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    BaseActions: bindActionCreators(baseCreators, dispatch)
})

export default connect<StateProps, DispatchProps, OwnProps>(
    mapStateToProps,
    mapDispatchToProps
)(Main);