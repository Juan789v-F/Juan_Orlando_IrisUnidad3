import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Register</h1>
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
