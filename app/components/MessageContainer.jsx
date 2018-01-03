import React, {Component} from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import autobind from 'autobind-decorator'
import immutable from 'immutable'
import TextMessage from './TextMessage.jsx'
import ImageMessage from './ImageMessage.jsx'
import FileMessage from './FileMessage.jsx'
import messageMiddle from '../middlewares/message.js'
import SignOwl from './SignOwl.jsx'
import Loading from './Loading.jsx'
import language from '../config/language.js'
import fiora from '../middlewares/fiora.js'
import {loadRoomHistory, errPrint} from '../actions/combin.js'
import {setMenuState} from '../actions/pageUI.js'
import scroll from '../util/scroll.js'

import '../less/MessageContainer.less'

class MessageContainer extends Component {
    constructor(props){
        super(props);
        this.needScroll = true;
        // 保留上次滚动条所在的高度，用于回滚
        this.perHeight = 0;
        this.state = {loading: false, scrollToBottom: false};
    }
    @autobind 
    scrollToBottom(){
        if(this.msgContent){
            const msg = this.msgContent;
            scroll.scrollTo(
                msg.scrollTop,
                msg.scrollHeight,
                300,
                (val, finish) => {
                    msg.scrollTop = val;
                }
            )
        }
    }
    @autobind
    handleScroll(e){
        const target = e.target;
        if(target !== this.msgContent){
            return;
        }
        if(target.scrollHeight !== target.offsetHeight && target.scrollTop === 0 && !this.state.loading){
            this.needScroll = false;
            this.preHeight = target.scrollHeight;
            this.setState({loading: true});
            loadRoomHistory()
            .then(ret => this.setState({loading: false}))
            .then(ret => {
                target.scrollTop = target.scrollHeight - this.preHeight;
            })
            .catch(err => errPrint(err))
        }
        if(target.scrollHeight < target.offsetHeight + target.scrollTop + 10){
            if (this.state.scrollToBottom) this.setState({scrollToBottom: false});
            if(!this.needScroll) this.needScroll = true;
        }
        if(target.scrollHeight > target.offsetHeight + target.scrollTop + 30 && !this.scrollToBottom){
            this.needScroll = false;
        }
        if(target.scrollHeight > target.offsetHeight + target.scrollTop + 130 && !this.scrollToBottom){
            this.setState({scrollToBottom: true});
        }
    }
    // 对比一下收到的消息是否为自己发送
    compareProps(nextProps){
        const thisProps = this.props,
              arr = immutable.fromJS([]);
        const tArr = thisProps.roomInfo.get('histories') || arr,
              nArr = nextProps.roomInfo.get('histories') || arr;
        const tSize = tArr.size,
              nSize = nArr.size,
              nUser = nextProps.messagesObj.getIn([nArr.last(), 'owner', '_id']);
        if(1 === nSize - tSize && nUser === thisProps.user.get('_id')) return true;
        return false;
    }
    componentWillReceiveProps(nextProps){
        const thisProps = this.props,
              msgContent = this.msgContent || {};
        const tScrollId = thisProps.msgContainerScroll.get('_id'),
              nScrollId = nextProps.msgContainerScroll.get('_id');
        // 判断所有可能改变滚动状态情况
        // 滚动条未滚动到末尾时不下移
        if(msgContent.scrollHeight > msgContent.offsetHeight + msgContent.scrollTop + 10) this.needScroll = false;
        // 外部设定是否下移
        if(tScrollId !== nScrollId) this.needScroll = nextProps.msgContainerScroll.get('needScroll');
        // 自己发送消息必然下移
        if(this.compareProps(nextProps)) this.needScroll = true;
    }
    componentDidUpdate(){
        if(this.needScroll){
            const imglist = this.msgContent.querySelectorAll('img');
            const lastImg = imglist[imglist.length - 1];
            setTimeout(this.scrollToBottom, 100);
            lastImg && lastImg.addEventListener('load', this.scrollToBottom);
        }
    }
    render(){
        const { roomInfo, messagesObj, user, showExpression, showImage } = this.props;
        const messagesArr = roomInfo.get('histories') || immutable.fromJS([]);
        const style = {height: `calc(100% - 121px - ${showExpression ? '283px' : '0px'})`};
        return (
            <div className = 'MessageContainer' style = {style}>
                {user.get('onlineState') === 'offline' && <div className = 'MessageContainer-offline'>{language.offline}</div>}
                <div
                    className = 'MessageContainer-SignOwl'
                    onClick = {() => setMenuState(true)}
                >
                    <SignOwl isFocus = {this.props.owlState}/>
                </div>
                <ReactCSSTransitionGroup 
                    component = 'div'
                    transitionName = 'DialogScale'
                    transitionEnterTimeout = {250}
                    transitionLeaveTimeout = {250}
                >
                    { this.state.scrollToBottom && <ScrollButton handleClick = {this.scrollToBottom}/>}
                </ReactCSSTransitionGroup>
                { this.state.loading && <Loading /> }
                <div className = 'MessageContainer-content' ref = {ref => this.msgContent = ref} onScroll = {this.handleScroll}>
                    {
                        messagesArr.map((id) => {
                            if(!messagesObj.get(id)){
                                return null;
                            }
                            let message = messageMiddle.priToGro(messagesObj.get(id), roomInfo, user);
                            message = immutable.fromJS(fiora.dealFioraMessage(message.toJS()));
                            const dir = user.get('_id') === message.getIn(['owner', '_id']) ? 'right' : 'left';
                            message = message.set('dir', dir);
                            switch(message.get('type')){
                                case 'text': {
                                    return <TextMessage 
                                        content = {message}
                                        key = {`message-${message.get('_id')}`}
                                    />;
                                }
                                case 'image': {
                                    return <ImageMessage 
                                        content = {message}
                                        showImage = {showImage}
                                        key = {`message-${message.get('_id')}`}
                                    />;
                                }
                                case 'file': {
                                    return <FileMessage 
                                        content = {message}
                                        key = {`message-${message.get('_id')}`}
                                    />;
                                }
                                default: return null;
                            }
                        })
                    }
                </div>
                <div className = 'MessageContainer-background'></div>
            </div>
        );
    }
}

// 下滑至底部按钮
function ScrollButton(props){
    return (
        <div className = 'MessageContainer-ScrollButton' onClick = {props.handleClick}>
            <i className = 'icon'>&#xe60d;</i>
        </div>
    )
}

export default MessageContainer;