import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";

export default function Login() {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  return (
    !isAuthenticated && (
      <Button variant="contained" onClick={() => loginWithRedirect()}>
        Log In
      </Button>
    )
  );
}