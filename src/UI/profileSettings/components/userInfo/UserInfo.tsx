import React from 'react';
import Image from 'next/image';
import styles from './style.module.scss';

interface UserInfoProps {
  userName: string;
  userInfo: any;
  editedInfo: any;
  isEditing: boolean;
  isLoading: boolean;
  avatarPreview: string | null;
  loveGameData: any[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  onAvatarClick: () => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onRemoveGame: (appid: string) => void;
  router: any;
}

const UserInfo: React.FC<UserInfoProps> = ({
  userName,
  userInfo,
  editedInfo,
  isEditing,
  isLoading,
  avatarPreview,
  loveGameData,
  fileInputRef,
  onAvatarClick,
  onAvatarChange,
  onEdit,
  onSave,
  onCancel,
  onRemoveGame,
  router,
}) => {
  if (!userInfo) return <div>Loading...</div>;

  return (
    <div className={styles.userInfo}>
      <div className={styles.topSection}>
        <div className={styles.avatarWrapper} onClick={onAvatarClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' ? onAvatarClick() : null}>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={onAvatarChange}
            accept="image/*"
          />
          {avatarPreview ? (
            <Image src={avatarPreview} alt="avatar" width={88} height={88} />
          ) : (
            <div className={styles.placeholderAvatar}>
              {userName.charAt(0).toUpperCase() + userName.charAt(userName.length - 1).toUpperCase()}
            </div>
          )}
          <div className={styles.avatarRing} />
        </div>

        <div className={styles.userInfoRight}>
          <h2>{userName}</h2>
          <div className={styles.actionsRow}>
            <button
              className={styles.libraryBtn}
              onClick={() => router.push('/library')}
            >
              Библиотека
            </button>
          </div>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{userInfo.totalGames ?? '—'}</span>
          <span className={styles.statLabel}>Всего игр</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{loveGameData?.length ?? 0}</span>
          <span className={styles.statLabel}>Любимые</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{userInfo.totalHours ?? '—'}</span>
          <span className={styles.statLabel}>Часы</span>
        </div>
      </div>

      <div className={styles.description}>
        {isEditing ? (
          <textarea
            value={editedInfo.descriptionProfile}
            onChange={(e) => (editedInfo.descriptionProfile = e.target.value)}
            rows={4}
            placeholder="Напишите что-то о себе..."
          />
        ) : (
          <p>{userInfo.descriptionProfile || 'Описание отсутствует'}</p>
        )}
      </div>

      {isEditing && (
        <div className={styles.editButton}>
          <button onClick={onSave} disabled={isLoading}>Сохранить</button>
          <button onClick={onCancel} disabled={isLoading} className={styles.cancelBtn}>Отмена</button>
        </div>
      )}
      {!isEditing && (
        <button className={styles.editBtnGhost} onClick={onEdit}>
          Редактировать
        </button>
      )}
    </div>
  );
};

export default UserInfo;
