import { FC, useCallback } from 'react';
import styled from '@emotion/styled';
import voyagerImg from './voyager.png';
import { css } from '@emotion/react';

export const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

export const parseStringDateToInt = (date: number | string | Date): number => {
  const parseDate = Date.parse(date as string);

  if (!isNaN(parseDate)) {
    return parseDate;
  }

  if (typeof date == 'string') {
    return parseInt(date);
  }

  return (date as unknown) as number;
};

interface IProps {
  portOfLoading: string;
  portOfDischarge: string;
  departureTime: string | Date;
  arrivalTime: string | Date;
  currentTime: string | Date;
}

export const VoyageProgress: FC<IProps> = ({
  portOfDischarge,
  portOfLoading,
  currentTime,
  departureTime,
  arrivalTime,
}) => {
  const parsedDepartureTime = useCallback(() => parseStringDateToInt(departureTime), [departureTime]);
  const parsedCurrentTime = useCallback(() => parseStringDateToInt(currentTime), [currentTime]);
  const parsedArrivalTime = useCallback(() => parseStringDateToInt(arrivalTime), [arrivalTime]);

  // Get the total possible timestamp value
  const total = parsedArrivalTime() - parsedDepartureTime();

  // Get the current value
  const current = parsedCurrentTime() - parsedDepartureTime();

  // Get the percentage for timeline progress
  const percentage = useCallback(() => (current / total) * 100, [current, total]);

  // use Math.floor to return integer less or equal to a given number. Use clamp function to ensure min and max amount of steps to be rendered properly.
  const flooredStepper = clamp(Math.floor((percentage() / 100) * 13), 0, 13);

  const voyagerImageTransformTranslate = clamp(flooredStepper * 40, 0, 520); // 40 is value of pixels each step should move in order Voyage renders in right place

  return (
    <div data-testid="voyager-test">
      <StyledHeadline>Voyagger challenge</StyledHeadline>
      <StyledContainer>
        <StyledVoyagerImg src={voyagerImg as never} translateX={voyagerImageTransformTranslate as never} />
        <StyledTimeline data-testid="timeline-test">
          <StyledBubble big position="first" key={'first'} />
          {[...Array(12).keys()].map((index) => {
            // using index as key is bad practive but in this case we are not changing number of elements rendered in DOM
            // using index in this case prevents re-rendering of the DOM which results in better performance
            return <StyledBubble isSelected={flooredStepper > index} key={index} />;
          })}
          <StyledBubble big isSelected={flooredStepper === 13} position="last" key={'last'} />
        </StyledTimeline>
        <StyledPortContainer>
          <p>{portOfLoading}</p>
          <p>{portOfDischarge}</p>
        </StyledPortContainer>
      </StyledContainer>
    </div>
  );
};

const StyledHeadline = styled.h1`
  color: #82a1bf;
`;

const StyledContainer = styled.div`
  background: white;
`;

const StyledTimeline = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 45px;
`;

const StyledBubble = styled.div<{ position?: 'first' | 'last'; big?: boolean; isSelected?: boolean }>`
  width: ${({ big }) => (big ? '30px' : '10px')};
  height: ${({ big }) => (big ? '30px' : '10px')};
  background: ${({ isSelected }) => (isSelected ? '#355471' : '#82a1bf')};
  border-radius: 50%;
  margin: 0 30px 0 0;

  ${({ position }) => position && bigStyledBubble[position]}
`;

const bigStyledBubble = {
  first: css`
    background: #355471;
    margin: 0 20px 0 -10px;
  `,
  last: css`
    margin: 0 15px 0 -10px;
  `,
};

const StyledPortContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  max-width: 590px;
  margin: 0px 20px;
`;

interface StyledVoyagerImage {
  translateX: number;
  src: string;
}

const StyledVoyagerImg = styled.img<StyledVoyagerImage>`
  transform: ${({ translateX }: StyledVoyagerImage) => `translateX(${translateX}px)`};
  display: block;
  width: 100px;
  margin: 0 0 15px 0;
`;
