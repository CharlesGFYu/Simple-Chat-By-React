import React, {Component} from 'react'
import autobind from 'autobind-decorator'
import {connect} from 'react-redux'
import {shouldComponentUpdate} from '../plugins/PureRender.js'
import {getPrivateInfo} from '../actions/activeList.js'
import ContactProfile from '../components/ContactProfile.jsx'

const ContactProfileWrap = (WrappedComponent) => class extends Component {
    constructor(props) {
        super(props);
        this.shouldComponentUpdate = shouldComponentUpdate.bind(this);
        this.state = {isLoading: true};
    }
    componentDidMount () {
        this.isMount = true;
        const _id = this.props.curRoom;
        getPrivateInfo({_id})
        .then((ret) => {
            ret.isLoading = false;
            this.isMount && this.setState(ret);
        })
    }
    componentWillMount () {
        this.isMount = false;
    }
    render () {
        return <WrappedComponent {...this.state} {...this.props}/>
    }
}

export default ContactProfileWrap(ContactProfile);