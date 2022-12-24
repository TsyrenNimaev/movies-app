import React, { Component } from 'react';
import { Pagination } from 'antd';

import './style.css';

export default class PaginationApp extends Component {
  render() {
    const { togglePage, currentPage, totalPages } = this.props;
    return <Pagination onChange={(page) => togglePage(page)} current={currentPage} total={totalPages * 10} />;
  }
}
