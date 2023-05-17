import {
  Card,
  CardBody,
  Flex,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  Box,
  useSteps,
  useBreakpointValue
} from '@chakra-ui/react';
import { FiInfo } from 'react-icons/fi';

// Mock
const steps = [
  { title: 'Top 50%', description: `10 txs` },
  { title: 'Top 25%', description: '50 txs' },
  { title: 'Top 10%', description: '100 txs' }
];

export default function ProgressTrackerCard() {
  const { activeStep } = useSteps({
    index: 1,
    count: steps.length
  });
  const stepperOrientation: 'horizontal' | 'vertical' | undefined =
    useBreakpointValue(
      {
        base: 'vertical',
        md: 'horizontal',
        lg: 'vertical',
        xl: 'horizontal'
      },
      {
        fallback: 'md'
      }
    );
  return (
    <Card size="lg">
      <CardBody>
        <Flex direction="row" gap={4} alignItems="center">
          <Stepper
            index={activeStep}
            colorScheme="primary"
            orientation={stepperOrientation}
            width="100%"
          >
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>
          <Tooltip label="More Info" hasArrow>
            <IconButton
              aria-label="Previous"
              icon={<FiInfo />}
              variant="link"
            />
          </Tooltip>
        </Flex>
      </CardBody>
    </Card>
  );
}
