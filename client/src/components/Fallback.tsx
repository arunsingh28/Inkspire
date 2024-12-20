import React from "react";
import { Result, Button } from "antd";

interface FallbackProps {
  onRetry?: () => void;
}

const Fallback: React.FC<FallbackProps> = ({ onRetry }) => {
  return (
    <Result
      status="error"
      title="Something went wrong"
      subTitle="An unexpected error occurred. Please try again later."
      extra={[
        <Button type="primary" key="retry" onClick={onRetry}>
          Retry
        </Button>,
      ]}
    />
  );
};

export default Fallback;
