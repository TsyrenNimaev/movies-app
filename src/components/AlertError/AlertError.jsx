import React from 'react';
import { Alert } from 'antd';

const AlertError = ({ error }) => <Alert description={error} type="error" showIcon />;

export default AlertError;
