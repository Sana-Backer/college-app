import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginApi } from "../services/allAPI";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
// import './login.css';

function Login() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!userData.email || !userData.password) {
      toast.error("Please enter all fields");
      return;
    }

    try {
      const result = await loginApi(userData);
      if (result.status === 200) {
        localStorage.setItem("loggedUser", JSON.stringify(result.data));
        localStorage.setItem("access", result.data.access);
        localStorage.setItem("username", result.data.full_name);
        localStorage.setItem("userId", result.data.id);
        localStorage.setItem("role", result.data.role);
        localStorage.setItem("department", result.data.department);
        localStorage.setItem("course", result.data.course);
        localStorage.setItem("subject", result.data.subject);

        setUserData({ email: "", password: "" });
        toast.success("Login successful");
        navigate("/home");
      } else if (result.status === 401) {
        toast.error("Invalid email or password");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col md={6} className="d-none d-md-block">
          <Image
            src="https://img.freepik.com/premium-photo/student-black-man-books-study-home-desk-thinking-reading-studying-college-person-learning-focused-information-page-education-knowledge-working-law-research_590464-177778.jpg"
            alt="Student studying"
            fluid
            className="rounded"
          />
        </Col>
        <Col md={6}>
          <div className="log-content">
            <h2 className="text-center">WELCOME BACK</h2>
            <p className="text-center">Welcome back! Please enter your details.</p>

            <Form onSubmit={handleLogin}>
              <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check type="checkbox" label="Remember me" />
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>

              <Button type="submit" variant="primary" className="w-100 mb-3">
                Sign in
              </Button>
            </Form>

            <Button variant="outline-primary" className="w-100 mb-3">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
                alt="Google logo"
                className="me-2"
                style={{ width: '20px' }}
              />
              Sign in with Google
            </Button>

            <p className="text-center">
              Don't have an account? <Link to="/signup">Click here to signup</Link>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
