import React, { useCallback } from 'react';
import styles from './style.module.scss';
import { useActions } from '@/hooks/useActions';
import { useTypeSelector } from '@/hooks/useTypeSelector';
import Link from 'next/link';
import { TUserInfo } from '@/types/userInfo';
import Image from 'next/image';
import { FaRegImages } from 'react-icons/fa';

interface PropsUserInfo {
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  userData: TUserInfo;
  editedUserData: TUserInfo;
  setEditedUserData: React.Dispatch<React.SetStateAction<TUserInfo>>;
  onSave: () => void;
}

const UserInfo: React.FC<PropsUserInfo> = ({
  isEditing,
  setIsEditing,
  userData,
  editedUserData,
  setEditedUserData,
  onSave,
}) => {
  const { userData: userReg } = useTypeSelector(then => then.regField)

  const name = userData.userName.split(" ")
  const shortname = name.length >= 2 ? name[0].charAt(0).toUpperCase() + name[1].charAt(0).toUpperCase() : name[0].charAt(0).toUpperCase() + name[0].charAt(name[0].length - 1).toUpperCase()

  const isThisUser = userReg && userReg._id == userData._id
  

  const renameAvatar = useCallback((file: File, userId: string) => {
    return new File([file], `avatar_${userId}`, { type: 'image/webp' });
  }, []);

  // Пример статистики (можно заменить на реальные данные)
  const stats = [
    { label: 'Игры', value: userData.userGamesId?.length ?? 0 },
    { label: 'Отзывы', value: userData?.userGamesId?.filter(game => game.description.length ?? 0).length },
  ];
  // console.log(editedUserData._avatarFile ? URL.createObjectURL(editedUserData._avatarFile) : userReg.lastAvatarIMG || `http://localhost:3452/img/uploads/${userData.avatar}&ts=${userReg.lastUpdated}`);

  return (
    <div className={styles.userInfo}>
      <div className={styles.topSection}>
        <div className={styles.avatarWrapper}>
          {isEditing ? (
            <label className={styles.avatarUpload}>
              {editedUserData?.avatar ? (
                <Image
                  src={editedUserData._avatarFile ? URL.createObjectURL(editedUserData._avatarFile) : userReg?.lastAvatarIMG || `http://localhost:3452/img/uploads/${userData.avatar}`}
                  alt="Avatar"
                  className={styles.avatar}
                  width={100}
                  height={150}
                  quality={100}
                  placeholder={'blur'}
                  blurDataURL={`http://localhost:3452/img/uploads/${userData.avatar}?w=10&h=10&q=10`}
                />
              ) : (
                <div className={styles.placeholderAvatar}>
                  {shortname}
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const renamedFile = renameAvatar(file, userData._id);
                    setEditedUserData(prev =>
                      prev ? {
                        ...prev,
                        avatar: renamedFile.name,
                        _avatarFile: renamedFile
                      } : prev
                    );
                  }
                }}
                style={{ display: 'none' }}
              />
              <div className={styles.uploadOverlay}>
                <FaRegImages />
                <span>Изменить фото</span>
              </div>
            </label>
          ) : (
            <>
              {userData.avatar ? (
                <Image
                  src={`http://localhost:3452/img/uploads/${userData.avatar}`}
                  alt="Avatar"
                  className={styles.avatar}
                  width={100}
                  height={150}
                  quality={100}
                  placeholder={'blur'}
                  blurDataURL={`http://localhost:3452/img/uploads/${userData.avatar}?w=10&h=10&q=10`}
                />
              ) : (
                <div className={styles.placeholderAvatar}>
                  {shortname}
                </div>
              )}
            </>
          )}
          <div className={styles.avatarRing} />
        </div>
        <div className={styles.userInfoRight}>
          {isEditing ? (
            <input
              type="text"
              className={styles.usernameInput}
              value={editedUserData.userName}
              onChange={(e) =>
                setEditedUserData((prev) => ({
                  ...prev,
                  userName: e.target.value,
                }))
              }
              placeholder="Ваше имя"
            />
          ) : (
            <>
              <h2>{userData.userName}</h2>
              <h3 style={{ color: 'rgba(158, 158, 158, 1)' }}>{userData.login}</h3>
            </>
          )}
          {!isEditing && <div className={styles.profileActions}>
            <Link href={`/library/${userData.login}`} className={styles.libraryBtn}>
              Библиотека
            </Link>
          </div>}
        </div>
      </div>

      <div className={styles.statsRow}>
        {stats.map((stat, idx) => (
          <div className={styles.statItem} key={idx}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className={styles.privacyToggle}>
          <label className={styles.switch}>
            <input
              type="checkbox"
              checked={editedUserData.profileId.isCloseProfile}
              onChange={(e) =>
                setEditedUserData((prev) =>
                  prev
                    ? {
                      ...prev,
                      userInfo: {
                        ...prev,
                        isCloseProfile: e.target.checked,
                      },
                    }
                    : prev
                )
              }
            />
            <span className={styles.slider}></span>
          </label>
          <span>Скрытый профиль</span>
        </div>
      )}

      <div className={styles.description}>
        {isEditing ? (
          <textarea
            value={editedUserData.profileId?.descriptionProfile}
            onChange={(e) =>
              setEditedUserData((prev) =>
                prev
                  ? ({
                    ...prev,
                    profileId: prev.profileId ? {
                      ...prev.profileId,
                      descriptionProfile: e.target.value,
                    } : prev.profileId,
                  })
                  : prev,
              )
            }
            rows={4}
            placeholder="Напишите что-то о себе..."
          />
        ) : (
          <>
            <span className={styles.label}>Описание</span>
            <p>{userData.profileId?.descriptionProfile || 'Описание отсутствует'}</p>
          </>
        )}
      </div>

      {!isEditing && userData.profileId.isCloseProfile && (
        <div className={styles.privateIndicator}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C9.243 2 7 4.243 7 7v3H6c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-1V7c0-2.757-2.243-5-5-5zm6 10v8H6v-8h12zm-9-2V7c0-1.654 1.346-3 3-3s3 1.346 3 3v3H9z" fill="#888" />
          </svg>
          <span>Скрытый профиль</span>
        </div>
      )}

      {isThisUser && <div className={styles.actionsRow}>
        {isEditing ? (
          <div className={styles.editButtons}>
            <button onClick={onSave}>Сохранить</button>
            <button
              className={styles.cancelBtn}
              onClick={() => {
                setEditedUserData(userData); // сброс изменений
                setIsEditing(false);
              }}
            >
              Отмена
            </button>
          </div>
        ) : (
          <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
            Редактировать
          </button>
        )}
      </div>
      }
    </div>
  );
};

export default UserInfo;
