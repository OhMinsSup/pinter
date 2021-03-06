import * as React from 'react';
import * as classNames from 'classnames/bind';
import * as moment from 'moment';
import { Link } from 'react-router-dom';

const styles = require('./CommonCard.scss');
const cx = classNames.bind(styles);

type Props = {
  comments: number;
  likes: number;
  username: string;
  displayName: string;
  thumbnail: string;
  urls: string[];
  body: string;
  createdAt: string;
  relationUrl: string;
  id: string;
  theme?: string;
  onOpen(id: string): Promise<void>;
};

const CommonCard: React.SFC<Props> = ({
  urls,
  thumbnail,
  createdAt,
  displayName,
  comments,
  likes,
  body,
  relationUrl,
  onOpen,
  username,
  id,
  theme,
}) => {
  return (
    <div className={cx('common-card', theme)}>
      {urls ? (
        <div className={cx('thumbnail-wrapper')} onClick={() => onOpen(id)}>
          <img src={urls[0]} alt={username} />
          <div className={cx('white-mask')} />
        </div>
      ) : null}
      <div className={cx('card-content')}>
        <Link to={`/@${displayName}`} className={cx('user-thumbnail-wrapper')}>
          <img src={thumbnail} alt={displayName} />
        </Link>
        <div className={cx('content-head')}>
          <Link to={`/@${displayName}`} className={cx('displayName')}>
            {displayName}
          </Link>
          <div className={cx('subinfo')}>
            <span>{moment(createdAt).format('ll')}</span>
            <span>{comments} 개의 댓글</span>
            <span>{likes} 개의 좋아요</span>
          </div>
        </div>
        <div className={cx('description')}>
          <Link to={`/pin/${id}`}>{body}</Link>
          <span
            className={cx('relation')}
            onClick={() => window.open(`${relationUrl}`)}
          >
            {relationUrl}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommonCard;
