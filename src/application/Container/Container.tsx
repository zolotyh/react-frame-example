import styles from './Container.module.css'
import {Main} from "../Main/Main.tsx";
import {Sidebar} from "../Sidebar/Sidebar.tsx";

export const Container = () => <div className={styles.container}>
    <Sidebar/>
    <Main/>
</div>