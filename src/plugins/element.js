/* eslint-disable import/no-duplicates */
import Vue from 'vue'
import {
    Button, Form, FormItem, Input, Message, Container, Header, Aside,
    Main, Menu, Submenu, MenuItemGroup, MenuItem, Breadcrumb,
    BreadcrumbItem, Card, Row, Col, Table, Cascader, Tabs, TabPane,
    TableColumn, Switch, Tooltip, Pagination, Alert, Checkbox, Upload,
    Dialog, MessageBox, Tag, Tree, Select, Option, Step, Steps, CheckboxGroup
} from 'element-ui'
Vue.use(Upload)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Step)
Vue.use(Steps)
Vue.use(TabPane)
Vue.use(Tabs)
Vue.use(Alert)
Vue.use(Cascader)
Vue.use(Option)
Vue.use(Select)
Vue.use(Tree)
Vue.use(Tag)
Vue.use(Dialog)
Vue.use(Pagination)
Vue.use(Tooltip)
Vue.use(Switch)
Vue.use(TableColumn)
Vue.use(Table)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Container)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 全局挂载
Vue.prototype.$message = (Message)
Vue.prototype.$confirm = MessageBox.confirm
