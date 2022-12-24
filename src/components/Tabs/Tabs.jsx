import React, { Component } from 'react';
import { Tabs } from 'antd';

import './style.css';

export default class TabsButton extends Component {
  render() {
    const { onChangeTabs } = this.props;

    const items = [
      { label: 'Search', key: 'search', destroyInactiveTabPane: 'false', title: 'Search' },
      { label: 'Rated', key: 'rated', destroyInactiveTabPane: 'false', title: 'Rated' },
    ];

    return <Tabs items={items} onChange={onChangeTabs} />;
  }
}
