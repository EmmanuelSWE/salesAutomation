'use client'
import { Input, Button } from "antd";
import Link from "next/link";
import { useSignupStyles } from "../../components/signup/signup.module";

const Signup = () => {
    const { styles } = useSignupStyles();

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Register</h1>
                <div className={styles.subtitle}>Create your account</div>

                <form
                    action="/api/register"
                    method="post"
                >
                    {/* Full Name */}
                    <div style={{ marginBottom: 16 }}>
                        <Input
                            name="fullName"
                            placeholder="Full Name"
                            className={styles.input}
                            autoComplete="name"
                        />
                    </div>

                    {/* Email */}
                    <div style={{ marginBottom: 16 }}>
                        <Input
                            name="email"
                            type="email"
                            placeholder="E-mail"
                            className={styles.input}
                            autoComplete="email"
                        />
                    </div>

                    {/* Phone */}
                    <div style={{ marginBottom: 16 }}>
                        <Input
                            name="phone"
                            placeholder="Phone"
                            className={styles.input}
                            autoComplete="tel"
                        />
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: 16 }}>
                        <Input.Password
                            name="password"
                            placeholder="Password"
                            className={styles.input}
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: 16 }}>
                        <Input.Password
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            className={styles.input}
                            autoComplete="new-password"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="primary"
                        htmlType="submit"
                        className={styles.button}
                    >
                        REGISTER
                    </Button>
                </form>

                {/* Footer with Sign In Link */}
                <div className={styles.footer}>
                    Have an account? 
                    <Link href="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;