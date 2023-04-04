import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Heading,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td
} from '@chakra-ui/react';
import TokenIcon from './TokenIcon';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const data = [
  {
    name: 'Jan',
    '0x293j...293k': 20,
    '0x2ks0...192j': 10,
    '0x293j...293g': 30
  },
  {
    name: 'Feb',
    '0x293j...293k': 25,
    '0x2ks0...192j': 8,
    '0x293j...293g': 27
  },
  {
    name: 'Mar',
    '0x293j...293k': 18,
    '0x2ks0...192j': 12,
    '0x293j...293g': 35
  },
  {
    name: 'Apr',
    '0x293j...293k': 22,
    '0x2ks0...192j': 15,
    '0x293j...293g': 28
  },
  {
    name: 'May',
    '0x293j...293k': 30,
    '0x2ks0...192j': 11,
    '0x293j...293g': 31
  },
  {
    name: 'Jun',
    '0x293j...293k': 35,
    '0x2ks0...192j': 18,
    '0x293j...293g': 25
  }
];

type TxnsOvertimeData = {
  address: string;
  txns: {
    total: number;
    average: number;
  };
  duration: number;
};

const TxnsOvertimeCard = ({ txData }: { txData: TxnsOvertimeData[] }) => {
  const keys = Object.keys(data[0]).filter(key => key !== 'name');
  const colors = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#a0d8f1',
    '#8884d8',
    '#82ca9d'
  ];
  return (
    <Card size={{ base: 'sm', md: 'md', lg: 'lg' }}>
      <CardHeader>
        <Flex direction="row" justifyContent="space-between">
          <Heading fontSize={{ base: 'md', lg: 'xl' }}>Txns over time</Heading>
          <Heading fontSize={{ base: 'md', lg: 'xl' }}>66</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {keys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={colors[index]}
              activeDot={{ r: 8 }}
            />
          ))}
        </LineChart>
      </CardBody>
    </Card>
  );
};

export default TxnsOvertimeCard;
