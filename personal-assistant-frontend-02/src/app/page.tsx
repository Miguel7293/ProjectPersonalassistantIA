import styles from "./page.module.css";
import SignIn from './sign-in/SignIn';

export default function Home() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <SignIn />
    </div>
  );
}
