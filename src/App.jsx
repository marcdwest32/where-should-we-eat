
import React from 'react';
import axios from 'axios';
import { Avatar } from '@material-ui/core';
import Preferences from './Preferences.jsx';
import SignIn from './SignIn.jsx';
import Header from './Header.jsx';
import Home from './Home.jsx';
import CreateGroup from './CreateGroup.jsx';
import UserSettings from './UserSettings.jsx';
import Group from './Group.jsx';
import AddUserForm from './AddUserForm.jsx';
import Options from './Options.jsx';
import './App.css';

const userImages = {
  oppossum: 'https://cdn.discordapp.com/attachments/635332255178424335/661017399109353502/image3.jpg',
  koala: 'https://cdn.discordapp.com/attachments/635332255178424335/661017399109353505/image4.jpg',
  kangaroo: 'https://cdn.discordapp.com/attachments/635332255178424335/661017398496854075/image2.jpg',
  bilby: 'https://cdn.discordapp.com/attachments/635332255178424335/661017398496854074/image1.jpg',
  sugarGlider: 'https://cdn.discordapp.com/attachments/635332255178424335/661017398068903937/image0.jpg',

};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: '',
      user: 'dot',
      userStatus: '',
      groups: [],
      dietaryRestriction: 'vegan',
      image: null,
      groupName: 'supercoolpeople',
      pricePoint: '',
      members: [],
      newMember: '',
      options: [{
        name: 'Four Barrel Rum',
        rating: 8,
        price: '$$',
        phone: '+14152520800',
        address: '375 Valencia St',
      },
      {
        name: 'Four Barrel Coffee',
        rating: 4,
        price: '$',
        phone: '+14152520800',
        address: '375 Amadee St',
      }],
      catagories: 'vegan',
      choser: '',
      showWinner: false,
      userImages,
    };
    this.handleViewChange = this.handleViewChange.bind(this);
    this.handlePreferenceChange = this.handlePreferenceChange.bind(this);
    this.handleSignInWithGoogle = this.handleSignInWithGoogle.bind(this);
    this.handleNewGroupName = this.handleNewGroupName.bind(this);
    this.handleNewGroupPricePoint = this.handleNewGroupPricePoint.bind(this);
    this.handleNewGroupSubmit = this.handleNewGroupSubmit.bind(this);
    this.handleUserSettings = this.handleUserSettings.bind(this);
    this.handleAddUserToGroup = this.handleAddUserToGroup.bind(this);
    this.handleNewGroupMember = this.handleNewGroupMember.bind(this);
    this.handleGetOptions = this.handleGetOptions.bind(this);
    this.getGroupMembers = this.getGroupMembers.bind(this);
    this.getUsersGroups = this.getUsersGroups.bind(this);
    this.handleGroupSetState = this.handleGroupSetState.bind(this);
    this.randomizer = this.randomizer.bind(this);
    this.handleSetState = this.handleSetState.bind(this);
    this.handleUserNameInput = this.handleUserNameInput.bind(this);
    this.handleUserStatusInput = this.handleUserStatusInput.bind(this);
    this.handleSignOutWithGoogle = this.handleSignOutWithGoogle.bind(this);
  }

  componentDidMount() {
    this.getUsersGroups(this.state.user);
    this.getGroupMembers(this.state.groupName);
  }

  handleViewChange(view) {
    console.log(`${view} button clicked`);
    this.setState({ view: `/${view}` });
  }

  handleSignInWithGoogle() {
    // TODO Being checked with Auth
    axios.get('/api/login')
      .then(this.handleViewChange('/userSettings'))
      .catch((err) => {
        console.error('error in handsigninwithgoogle', err);
      // TODO send error back to client
      });
  }

  handleSignOutWithGoogle() {
    axios.get('/api/logout')
      .then(this.handleViewChange('/login'))
      .catch((err) => {
        console.error('signouterr', err);
      });
  }

  hideToDo() {
    const hide = this;
    // wrapping to do in function so I can hide them and they do not stress me out
    // TODO axios.patch/groups:id/active toggles group active
    // TODO axios.get /choices  gives options of places to eat
    // TODO update group name .patch('/groups/:groupName/groupName'
    // TODO update group pricepoint '/groups/:groupName/pricePoint'

  // TODO get and post group history
  // TODO delete user from group .delete('/groups/:userName'
  // TODO create button to reset dietary restrictions axios.delete(/users/:usesrName/dietaryRestriction)
  // TODO delete group axios.delete('/groups)
  // TODO get all active groups .get('/groups/:userName/groups/active'
  // TODO get all inactive groups '/groups/:userName/groups/inactive'
  // TODO create button and write funciton to delete useraccount from db axios.delete(/users/:userName)
  }

  handleGetOptions() {
    const { catagories, pricePoint } = this.state;
    axios.get('/api/choices', {
      radius: 40000,
      categories: catagories,
      price: pricePoint,
    })
      .then((options) => this.setState({
        options,
      }));
  }

  handleSetState(k, v) {
    this.setState([k, v]);
    console.log('here', this.state);
  }

  handleUserSettings(k, v) {
    axios.post(`/api/users/${this.state.user}/${k}`, {
      k: v,
    }).then(this.handleSetState(k, v))
      .catch((err) => {
        console.error('error handleprefeerence change', err);
      });
    // TODO send error to client
  }

  getGroupMembers(group) {
    axios.get(`/api/groups/${group}/users`)
      .then((members) => {
        this.setState({
          members: members.data,
        });
      })
      .catch((err) => {
        console.error('getgroupmembers err', err);
      });
    // TODO send error to client
  }

  randomizer() {
    const { members } = this.state;
    const memberIndex = Math.floor(Math.random() * (members.length));
    this.setState({ choser: members[memberIndex].userName, showWinner: true });
  }

  handlePreferenceChange(k, v) {
    axios.patch(`/api/users/:${this.state.user}/${k}`, {
      k: v,
    })
      .then(this.handleSetState(k, v))
      .then(console.log(this.state))
      .catch((err) => {
        console.error('error handleprefeerence change', err);
      });
    // TODO send error to client
  }

  handleNewGroupPricePoint(newPricePoint) {
    this.setState({
      pricePoint: newPricePoint,
    });
  }

  handleNewGroupSubmit() {
    const {
      groupName, pricePoint, user,
    } = this.state;
    axios.post('/api/groups', {
      groupName,
      pricePoint,
      userName: user,
    })
      .catch((err) => {
        console.error('submiterr', err);
      });
    // TODO send error to client
  }

  handleNewGroupName(e) {
    this.setState({
      groupName: e.target.value,
    });
  }

  handleGroupSetState(groupName) {
    this.setState({ groupName });
  }

  getUsersGroups(user) {
    axios.get(`/api/users/${user}/groups`)
      .then((groupsList) => {
        this.setState((state) => {
          const groups = groupsList.data.map((group) => {
            state.groups.push(group);
            return {
              groups,
            };
          });
        })
          .catch((err) => {
            console.error('getusersgrouperr', err);
          });
      });
  }

  resetGameState() {
    this.setState({
      choser: '',
      showWinner: false,
    });
  }

  handlePass() {
    // this.setState()
    this.handleViewChange('group');
    // TODO need data to figure this out
    // getUsersGroups(user) {
    //   axios.get(`/api/users/${user}/groups`)
    //     .then((groupsList) => {
    //       this.setState((state) => {
    //         const groups = groupsList.data.map((group) => {
    //           state.groups.push(group);
    //           return {
    //             groups,
    //           };
    //         });
    //       })
    //         .catch((err) => {
    //           console.error('getusersgrouperr', err);
    //         });
    //     });
    // }
    // axios.get(`/api/groups/${group}/users`)
    //     .then((members) => {
    //       this.setState({
    //         members: members.data,
    //       });
    //     })
    //     .catch((err) => {
    //       console.error('getgroupmembers err', err);
    //     });
    //   // TODO send error to client
  }

  handleNewGroupMember(e) {
    this.setState({ newMember: e.target.value });
  }

  handleUserNameInput(e) {
    this.setState({ user: e.target.value });
  }

  handleAddUserToGroup() {
    // TODO combine this  function with handleNewGroupMember
    const { newMember } = this.state;
    axios.post('/api/user_group', {
      userName: newMember,
    })
      .catch((err) => {
        console.error('addusertogrouperr', err);
      });
  }

  handleUserStatusInput(e) {
    this.setState({ userStatus: e.target.value });
  }


  render() {
    const {
      view, groups, group, members, options, groupName, pricePoint, choser, showWinner, user, userImages,
    } = this.state;
    const {
      randomizer, getGroupMembers, handleGroupSetState, handleGetOptions, handlePreferenceChange,
      handleNewGroupMember, handleSetState, handleAddUserToGroup, handleViewChange,
      handleSignInWithGoogle, handleNewGroupName, handleNewGroupPricePoint, handleNewGroupSubmit,
      handleUserSettings, handleUserNameInput, handleUserStatusInput, handlePass, handleSignOutWithGoogle,
    } = this;
    let View;
    if (view === '/login') {
      View = <SignIn handleSignInWithGoogle={handleSignInWithGoogle}/>;
    } else if (view === '/profile') {
      View = <Preferences userImages={userImages} handleUserStatusInput={handleUserStatusInput} handleSetState={handleSetState} handleUserNameInput={handleUserNameInput}/>;
    } else if (view === '/createGroup') {
      View = <CreateGroup
      handleViewChange={handleViewChange}
      handleNewGroupName={handleNewGroupName}
      handlePreferenceChange={handlePreferenceChange}
      handleSetState={handleSetState}
      handleNewGroupPricePoint={handleNewGroupPricePoint}
      handleNewGroupSubmit={handleNewGroupSubmit}
      handleAddUserToGroup={handleAddUserToGroup}
      />;
    } else if (view === '/userSetting') {
      View = <UserSettings handleUserSettings={handleUserSettings} handleUserStatusInput={handleUserStatusInput} handleUserNameInput={handleUserNameInput}/>;
    } else if (view === '/group') {
      View = <Group user={user} userImages={userImages}group={group} groupName={groupName} groupMembers={members} pricePoint={pricePoint} handleGetOptions={handleGetOptions} getGroupMembers={getGroupMembers} handleViewChange={handleViewChange} randomizer={randomizer} choser={choser} showWinner={showWinner}/>;
    } else if (view === '/addUserToGroup') {
      View = <AddUserForm handleNewGroupMember={handleNewGroupMember} handleAddUserToGroup={handleAddUserToGroup} />;
    } else if (view === '/options') {
      View = <Options options={options} handlePass={handlePass}/>;
    } else {
      View = <Home groups={groups} getGroupMembers={getGroupMembers} handleViewChange={handleViewChange} handleGroupSetState={handleGroupSetState}/>;
    }

    return (
            <div>
                <Header handleViewChange={handleViewChange} handleSignInWithGoogle={handleSignInWithGoogle}handleSignOutWithGoogle={handleSignOutWithGoogle} />
                <Avatar src={userImages.kangaroo}/>
                {View}
        </div>

    );
  }
}


export default App;
