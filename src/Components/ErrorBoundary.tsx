import { Component, type ErrorInfo, type ReactNode } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { textColor, bgColor, dangerColor } from "../consts/colors";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches rendering errors from the subtree and shows a fallback UI
 * instead of crashing the whole app.
 *
 * Errors thrown by parseISODate (or any other validation) in deeply
 * nested components are caught here so the user sees a friendly message
 * rather than a blank screen.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Paper
          sx={{
            p: 4,
            borderRadius: "10px",
            backgroundColor: bgColor,
            textAlign: "center",
            mt: 3,
            border: `1px solid ${dangerColor}40`,
          }}
        >
          <Typography variant="h6" sx={{ color: dangerColor, mb: 1 }}>
            Something went wrong
          </Typography>
          <Typography variant="body2" sx={{ color: textColor, opacity: 0.7, mb: 2 }}>
            {this.state.error?.message ?? "An unexpected error occurred."}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => this.setState({ hasError: false, error: null })}
            sx={{
              color: textColor,
              borderColor: `${textColor}40`,
              textTransform: "none",
            }}
          >
            Try Again
          </Button>
        </Paper>
      );
    }

    return this.props.children;
  }
}
