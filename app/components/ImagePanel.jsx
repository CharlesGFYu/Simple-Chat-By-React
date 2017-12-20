import React, {Component} from 'react'
import autobind from 'autobind-decorator'
import Avatar from './Avatar.jsx'
import timeDeal from '../util/time.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import PureRender, {shouldCompnentUpdate} from '../plugins/PureRender.js'
import {addExpression} from '../actions/combin.js'
import '../less/ImagePanel.less'
class ImagePanel extends Component{
    constructor(props){
        super(props);
        this.state = {scale: 1};
    }
    @autobind
    handleZoomIn(){
        
    }
}