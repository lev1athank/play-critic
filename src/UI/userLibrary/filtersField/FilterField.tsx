import NewGame from './elements/newGame/NewGame'
import SearchGame from './elements/searchGame/SearchGame'
import styles from './style.module.scss'
const FilterField = () => {
  return (
    <div className={styles.filterField}>
        <SearchGame />
        <NewGame />
    </div>
  )
}

export default FilterField