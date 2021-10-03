import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { parseStringDateToInt, clamp, VoyageProgress } from './VoyageProgress';

it('parseStringDateToInt Date format', () => {
  const date = new Date('Sat Oct 02 2021 11:00 GMT+0200');
  const parsedDate = parseStringDateToInt(date);

  expect(parsedDate).toBe(1633165200000);
});

it('parseStringDateToInt String format', () => {
  const parsedDate = parseStringDateToInt('1633165200000');

  expect(parsedDate).toBe(1633165200000);
});

it('parseStringDateToInt Number format', () => {
  const parsedDate = parseStringDateToInt(1633165200000);

  expect(parsedDate).toBe(1633165200000);
});

it('clamp: Test max value to be 50 when input value is 100', () => {
  const clamped = clamp(100, 10, 50);

  expect(clamped).toBe(50);
});

it('clamp: Test min value to be 10 when input value is -10', () => {
  const clamped = clamp(-10, 10, 50);

  expect(clamped).toBe(10);
});

it('clamp: Test min value to be 20 when input value is 20', () => {
  const clamped = clamp(20, 10, 50);

  expect(clamped).toBe(20);
});

it('renders Voyager and have text portOfDischarge and portOfLoading defined', () => {
  const { getByTestId } = render(
    <VoyageProgress
      portOfDischarge={'Klaipeda'}
      portOfLoading={'Karlshamn'}
      departureTime={'1633068000000'}
      arrivalTime={'1633086000000'}
      currentTime={'1633075200000'}
    />
  );

  const element = getByTestId('voyager-test');

  expect(element).toHaveTextContent('Klaipeda');
  expect(element).toHaveTextContent('Karlshamn');
});

it('renders Voyager with 6th pin to be active. departureTime: 08:00, arrivalTime: 13:00, currentTime: 10:00', () => {
  const { getByTestId } = render(
    <VoyageProgress
      portOfDischarge={'Klaipeda'}
      portOfLoading={'Karlshamn'}
      departureTime={'1633068000000'}
      arrivalTime={'1633086000000'}
      currentTime={'1633075200000'}
    />
  );

  const element = getByTestId('timeline-test');

  expect(element.children[5]).toHaveStyle('background: #355471');
  expect(element.children[6]).toHaveStyle('background: #82a1bf');
});

it('renders Voyager with 14th pin to be active when time is past arrival time. departureTime: 08:00, arrivalTime: 13:00, currentTime: 14:00', () => {
  const { getByTestId } = render(
    <VoyageProgress
      portOfDischarge={'Klaipeda'}
      portOfLoading={'Karlshamn'}
      departureTime={'1633068000000'}
      arrivalTime={'1633086000000'}
      currentTime={'1633089600000'}
    />
  );

  const element = getByTestId('timeline-test');

  expect(element.children[13]).toHaveStyle('background: #355471');
  expect(element.children[14]).toBeUndefined();
});

it('renders Voyager with 1st pin to be active when time is past arrival time. departureTime: 08:00, arrivalTime: 13:00, currentTime: 07:00', () => {
  const { getByTestId } = render(
    <VoyageProgress
      portOfDischarge={'Klaipeda'}
      portOfLoading={'Karlshamn'}
      departureTime={'1633068000000'}
      arrivalTime={'1633086000000'}
      currentTime={'1633064400000'}
    />
  );

  const element = getByTestId('timeline-test');

  expect(element.children[0]).toHaveStyle('background: #355471');
  expect(element.children[1]).toHaveStyle('background: #82a1bf');
  expect(element.children[0]).toBeDefined();
});
