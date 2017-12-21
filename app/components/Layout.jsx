import React, {Component} from 'react'
import {connect} from 'react-redux'
import ManagerContainer from './ManagerContainer.jsx'
import PokeballLoading from '../containers/PokeballLoading.js'
import MessageContainer from '../containers/MessageContainer.js'
import InputArea from './InputArea.jsx'
import Header from './Header.jsx'
import LeftPanelHeader from '../containers/LeftPanelHeader.js'
import MessageHeader from '../containers/MessageHeader.js'
import ActiveList from '../containers/ActiveList.js'
import LeftManager from '../containers/LeftManager.js'
import RightManager from '../containers/RightManager.js'
import ImageExpression from '../containers/ImageExpression.js'
import Welcome from './Welcome.jsx'

import '../less/Layout.less'

function Layout(props){
    return (
        <div className="Layout-wrapper">
            {props.children}
            <PokeballLoading />
            <div className="Layout-container">
                <div className="manager-container">
                    <span className="manager-one"><LeftManager /></span>
                    <span className="manager-two"></span>
                    <span className="manager-three"><RightManager /></span>
                </div>
                <span className = {`pane-one pane-one-${props.menuState ? 'hidden' : 'show'}`}>
                    <LeftPanelHeader />
                    <ActiveList />
                </span>
                <span className = {props.showRightManager ? 'pane-three chat-area' : 'pane-two chat-area'}>
                    {
                        !props.curRoom ? 
                        <Welcome /> : 
                        <div>
                            <MessageHeader />
                            <MessageContainer />
                            <InputArea />
                            {props.showExpression ? <ImageExpression /> : null}
                        </div>
                    }
                </span>
            </div>
        </div>
    )
}

export default Layout;