import React, {memo, useState, useMemo} from 'react';
import useBoxedCallback from '..';
import {mount} from 'enzyme';

describe('useBoxedCallback', () => {
  test('should work', () => {
    const Button = memo(props => {
      const [renders, setRenders] = useState(0);
      useMemo(() => setRenders(times => times + 1), [props.onClick]);

      return <button onClick={props.onClick}>Renders: {renders}</button>;
    });

    const MyComponent = () => {
      const [clicks, setClicks] = useState(0);

      const onClick = useBoxedCallback(() => {
        setClicks(clicks + 1);
      });

      return (
        <React.Fragment>
          <p>Clicks: {clicks}</p>
          <Button onClick={onClick} />
        </React.Fragment>
      );
    };

    const comp = mount(<MyComponent />);

    comp.find('button').simulate('click');
    comp.find('button').simulate('click');
    comp.find('button').simulate('click');
    comp.find('button').simulate('click');

    const clicks = comp.find('p');
    const renders = comp.find('button');

    expect(clicks.text()).toEqual('Clicks: 4');
    expect(renders.text()).toEqual('Renders: 1');
  });

  test('should proxy arguments', () => {
    const Button = memo(props => {
      const [renders, setRenders] = useState(0);
      useMemo(() => setRenders(times => times + 1), [props.onClick]);

      return <button onClick={props.onClick}>Renders: {renders}</button>;
    });

    const MyComponent = () => {
      const [clicks, setClicks] = useState(0);

      const onClick = useBoxedCallback((event, c) => {
        setClicks(c + 1);
      }, clicks);

      return (
        <React.Fragment>
          <p>Clicks: {clicks}</p>
          <Button onClick={onClick} />
        </React.Fragment>
      );
    };

    const comp = mount(<MyComponent />);

    comp.find('button').simulate('click');
    comp.find('button').simulate('click');
    comp.find('button').simulate('click');
    comp.find('button').simulate('click');

    const clicks = comp.find('p');
    const renders = comp.find('button');

    expect(clicks.text()).toEqual('Clicks: 4');
    expect(renders.text()).toEqual('Renders: 1');
  });
});
