import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Home} from './page';
// import EmailLogin from './containers/landing/EmailLoginContainer';
// import Core from './containers/base/Core';

const App = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </React.Fragment>
  );
}
export default App;

/*
      <Route exact path='/' component={Home}/>
      <Route path='/(tags|users)' component={Home} />
      <Route exact path='/email-register' component={Register} />
      <Route exact path='/email-login' component={EmailLogin} />
      <Route exact path='/@:displayName/' component={User} />
      <Route exact path='/@:displayName/(pin|following|follower|saves)' component={User} />
      <Route exact path='/pin/:id' component={Pin}/>
      <Core />

*/