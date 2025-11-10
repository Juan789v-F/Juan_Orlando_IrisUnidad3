import LoginForm from '../components/LoginForm';

function LoginPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Login</h1>
        <LoginForm />
      </div>
    </div>
  );
}

export default LoginPage;
