import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { StoreState } from '../../store/modules';
import { tagsCreators } from '../../store/modules/list/tags';
import CommonCardList from '../../components/common/CommonCardList';
import { pinCreators } from '../../store/modules/pin';
import { baseCreators } from '../../store/modules/base';
import { createArray } from '../../lib/common';
import FakePinCard from '../../components/common/FakePinCard';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;
type OwnProps = {
    tag: string,
}

type TagPinsCardProps = StateProps & DispatchProps & OwnProps;

class TagPinList extends React.Component<TagPinsCardProps> {
    public onOpen = async (id: string) => {
        const { BaseActions, PinActions } = this.props;
        BaseActions.setPinImage(true);

        try {
            await PinActions.getPin(id);
        } catch (e) {
            console.log(e);
        }
    }


    public initialize = async () => {
        const { ListActions, tag } = this.props;

        try {
            await ListActions.getTagList(tag);
        } catch (e) {
            console.log(e);
        }
    }

    public componentDidMount() {
        this.initialize();
    }

    public render() {
        const { pins, loading } = this.props;
        const { onOpen } = this;
        if (loading) return createArray(pins.length).map(num => <FakePinCard key={num} />);

        return (
            <CommonCardList
                pins={pins}
                onOpen={onOpen}
                theme="tag"
            />
        )
    }
}

const mapStateToProps = ({ list }: StoreState) => ({
    pins: list.tags.tag.pins,
    loading: list.tags.tag.loading,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    BaseActions: bindActionCreators(baseCreators, dispatch),
    ListActions: bindActionCreators(tagsCreators, dispatch),
    PinActions: bindActionCreators(pinCreators, dispatch),
});

export default connect<StateProps, DispatchProps, OwnProps>(
    mapStateToProps,
    mapDispatchToProps
)(TagPinList);