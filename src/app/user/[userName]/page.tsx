import LibraryGame from "@/UI/userLibrary/libraryGame/LibraryGame";
import styles from "./style.module.scss"
import FilterField from "@/UI/userLibrary/filtersField/FilterField";


const UserPageName = () => {
  return (
    <div className={styles.userLibrary}>
      <FilterField />
      <LibraryGame />
    </div>
  )
}

export default UserPageName