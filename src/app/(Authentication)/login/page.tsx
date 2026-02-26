'use client'
import { Input, Button } from "antd";
import {useLoginStyles} from "../../components/login/login.module";
// If you plan to use a Server Action later, import it and set it on action={loginAction}
// import { loginAction } from "./actions";

const Login = () => {
    const {styles} = useLoginStyles();
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Login</h1>

        {/* Native HTML form (no AntD <Form/>) */}
        <form
          // EITHER post to an API route:
          action="/api/login"
          method="post"

          // OR (when ready) post to a Server Action:
          // action={loginAction}

          // Optional: add a class if you want extra spacing
          // className={styles.form}
        >
          {/* Username */}
          <div style={{ marginBottom: 16 }}>
            <Input
              name="username"
              placeholder="Username"
              className={styles.input}
              // autoComplete helps the browser fill the field
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 16 }}>
            <Input.Password
              name="password"
              placeholder="Password"
              className={styles.input}
              autoComplete="current-password"
            />
          </div>

          {/* Submit */}
          <Button
            type="primary"
            htmlType="submit"
            className={`${styles.button} globalButton`}
          >
            LOGIN
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;