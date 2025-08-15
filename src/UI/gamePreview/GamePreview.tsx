'use client'
import { useState } from 'react'
import styles from './style.module.scss'
import { ICard } from '@/types/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import GameStatsPanel from './gameStatsPanel/GameStatsPanel';
import { useTypeSelector } from '@/hooks/useTypeSelector';
import { useActions } from '@/hooks/useActions';
import apiClient from '@/tool/axiosClient';
import { toast } from 'react-toastify';
import { faSteam } from '@fortawesome/free-brands-svg-icons';





const formatDate = (iso: string) => {
	const d = new Date(iso);
	const day = String(d.getDate()).padStart(2, '0');
	const month = String(d.getMonth() + 1).padStart(2, '0');
	const year = d.getFullYear();
	return `${day}.${month}.${year}`;
}

const GamePreview = () => {
	const [showFullDescription, setShowFullDescription] = useState(false)
	const [showConfirmDelete, setShowConfirmDelete] = useState(false);
	const { isPreview, game, isUser } = useTypeSelector(state => state.newGame);
	const { toggleIsPreview, clearGame, toggleEditOrAdd, removeFromLibrary } = useActions()

	async function delGame(appid: number) {
		const result = await apiClient.delete('/api/deleteGame', {
			params: { appid }
		});
		if (result.status == 200) {
			toast.success("Игра удалена!", {
				position: "bottom-right",
				autoClose: 5000,
				theme: "colored",
			});
			removeFromLibrary(appid)
		}
		else
			toast.error("Ошибка удаления!", {
				position: "bottom-right",
				autoClose: 5000,
				theme: "colored",
			});
	}

	if (!game) return null;

	const totalScore = [game.gameplay, game.immersion, game.originality, game.story].reduce((sum, val) => sum + val, 0);

	return isPreview && (
		<>
			<div className={styles.modalOverlay}>
				<div className={styles.modal}>
					<button className={styles.closeButton} onClick={() => clearGame(true)}>×</button>

					<img src={`https://steamcdn-a.akamaihd.net/steam/apps/${game.appid}/header.jpg`} alt="Game cover" className={styles.cover} />
					<h2 className={styles.title}>
						<span onClick={() => {
							navigator.clipboard.writeText(game.name);
							toast.success("Название скопировано!", {
								position: "bottom-right",
								autoClose: 2000,
								theme: "colored",
							});
						}}>{game.name}</span>
						<FontAwesomeIcon
							onClick={() => window.open(`https://store.steampowered.com/app/${game.appid}`, '_blank')}
							icon={faSteam}
							style={{
								marginLeft: "8px",
								cursor: 'pointer',
								padding: '5px',
								backgroundColor: 'var(--black)',
								borderRadius: '9px'
							}}
						/>
					</h2>
					<div className={
						`${styles.statusBadge} ` +
						(game.status === 'completed' ? styles.statusCompleted :
							game.status === 'requested' ? styles.statusAbandoned : styles.statusNone)
					}>
						{game.status == 'completed' ? 'пройдена' : game.status == 'requested' ? 'заброшена' : 'без статуса'}
					</div>

					<div className={styles.scores}>
						<div><span>Сюжет:</span><strong>{game.story}</strong></div>
						<div><span>Геймплей:</span><strong>{game.gameplay}</strong></div>
						<div><span>Оригинальность:</span><strong>{game.originality}</strong></div>
						<div><span>Погружение:</span><strong>{game.immersion}</strong></div>
						<div className={styles.total}><span>Общий балл:</span><strong>{totalScore}</strong></div>
					</div>

					<p className={styles.description} onClick={() => setShowFullDescription(true)}>
						{game.description.length ? game.description : 'Нет описания'}
					</p>
					<div className={styles.footer}>
						{game.createdAt && (
							<div className={styles.createdDate}>{`Создано: ${formatDate(game.createdAt)}`}</div>
						)}
						{
							isUser ? (
								<div className={styles.buttons}>
									<button className={styles.edit} onClick={() => toggleEditOrAdd(true)}>изменить<FontAwesomeIcon icon={faPenToSquare} style={{ marginLeft: "10px" }} /></button>
									<button className={styles.delete} onClick={() => setShowConfirmDelete(true)}>
										<FontAwesomeIcon icon={faTrash} />
									</button>
								</div>
							) : <></>
						}
					</div>
				</div>
				<GameStatsPanel
					appid={game.appid}
				/>
			</div >
			{showConfirmDelete && (
				<div className={styles.confirmOverlay} onClick={() => setShowConfirmDelete(false)}>
					<div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
						<h3>Подтверждение удаления</h3>
						<p>Вы уверены, что хотите удалить игру <br /><strong>«{game.name}»</strong>?</p>
						<div className={styles.confirmButtons}>
							<button className={styles.confirmDelete} onClick={() => {
								delGame(game.appid)
								clearGame(false)
								setShowConfirmDelete(false)
							}}>
								Да, удалить
							</button>
							<button className={styles.confirmCancel} onClick={() => {
								setShowConfirmDelete(false)
							}}>
								Отмена
							</button>
						</div>
					</div>
				</div>
			)
			}
			{
				showFullDescription && (
					<div className={styles.descriptionOverlay} onClick={() => setShowFullDescription(false)}>
						<div className={styles.fullDescription} onClick={(e) => e.stopPropagation()}>
							<h3>Описание</h3>
							<p>
								{game.description.length ? game.description : 'Нет описания'}
							</p>
						</div>
					</div>
				)
			}
		</>
	)
}

export default GamePreview
