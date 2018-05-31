import React, {Component} from 'react'
import {connect} from 'react-redux'
import autobind from 'autobind-decorator'
import {shouldComponentUpdate} from '../plugins/PureRender.js'
import InputContent from '../components/InputContent.jsx'
import {sendMessage,sendFile} from '../actions/combin.js'
import language from '../config/language.js'
import uploadHandle from '../util/upload.js'
import stateManage from '../util/stateManage.js'
import message from '../util/message.js'
import {createRoom, mergeUserInfo} from '../actions/user.js'

const InputContentWrap = (WrappedComponent) => class extends Component{
    constructor(props){
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
    }
    @autobind
    handleSend(content, ){}
}