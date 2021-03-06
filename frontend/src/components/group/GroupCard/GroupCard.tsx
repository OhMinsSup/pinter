import * as React from 'react';
import * as classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

const styles = require('./GroupCard.scss');
const cx = classNames.bind(styles);

type Props = {
  groupId: string;
  title: string;
  displayName: string;
  thumbnail: string;
  onDelete(groupId: string): Promise<void>;
};

const GroupCard: React.SFC<Props> = ({
  title,
  displayName,
  thumbnail,
  groupId,
  onDelete,
}) => {
  return (
    <div className={cx('group-card')}>
      <div className={cx('card-content')}>
        <Link to={`/@${displayName}`} className={cx('user-thumbnail-wrapper')}>
          <img src={thumbnail} alt={displayName} />
        </Link>
        <div className={cx('content-head')}>
          <Link to={`/@${displayName}`} className={cx('displayName')}>
            {displayName}
          </Link>
          <button onClick={() => onDelete(groupId)}>삭제</button>
          <h3>
            <Link to={`/@${displayName}/group/${groupId}`}>{title}</Link>
          </h3>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
