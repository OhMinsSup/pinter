import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Home, Register, Pin, NotFound, User, Write, Search } from './page';
import EmailLogin from './containers/auth/EmailLogin';
import Core from './containers/base/Core';
import SidebarContainer from './containers/base/SidebarContainer';
import GalleryContainer from './containers/common/GalleryContainer';

const App = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path='/(tags|users)/:tag?' component={Home} />
        <Route exact path='/email-register' component={Register} />
        <Route exact path='/email-login' component={EmailLogin} />
        <Route exact path='/write' component={Write} />
        <Route exact path='/pin/:id' component={Pin} />
        <Route exact path='/@:displayName' component={User} />
        <Route exact path="/@:displayName/(pin|following|follower|locker)" component={User} />
        <Route exact path="/search/(pin|user|tag)?" component={Search} />
        <Route component={NotFound} />
      </Switch>
      <Core />
      <SidebarContainer />
      <GalleryContainer />
    </React.Fragment>
  );
}
export default App;
