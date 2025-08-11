import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { VoltageReading } from '../types';

const { width } = Dimensions.get('window');

type TimeFilter = 'daily' | 'weekly' | 'monthly';

const GraphsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState<TimeFilter>('daily');
  const [voltageData, setVoltageData] = useState<VoltageReading[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>('all');

  // Mock data for demonstration
  useEffect(() => {
    generateMockData();
  }, [selectedFilter]);

  const generateMockData = () => {
    const now = new Date();
    const data: VoltageReading[] = [];
    let points = 24; // daily
    let interval = 1; // hours

    if (selectedFilter === 'weekly') {
      points = 7;
      interval = 24; // days
    } else if (selectedFilter === 'monthly') {
      points = 30;
      interval = 24; // days
    }

    for (let i = points - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * interval * 60 * 60 * 1000);
      data.push({
        timestamp: timestamp.getTime(),
        voltage: 110 + Math.random() * 20, // 110-130V
        current: 0.5 + Math.random() * 2, // 0.5-2.5A
        power: 50 + Math.random() * 200, // 50-250W
      });
    }
    setVoltageData(data);
  };

  const getChartData = () => {
    if (voltageData.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{ 
          data: [0],
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          strokeWidth: 2,
        }]
      };
    }

    const labels = voltageData.map((reading, index) => {
      const timestamp = new Date(reading.timestamp);
      if (selectedFilter === 'daily') {
        return `${timestamp.getHours()}:00`;
      } else if (selectedFilter === 'weekly') {
        return timestamp.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        return timestamp.getDate().toString();
      }
    });

    const voltageValues = voltageData.map(reading => reading.voltage || 0);
    const currentValues = voltageData.map(reading => reading.current || 0);
    const powerValues = voltageData.map(reading => reading.power || 0);

    return {
      labels,
      datasets: [
        {
          data: voltageValues,
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: currentValues.map(current => current * 50), // Scale for better visualization
          color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
          strokeWidth: 2,
        },
        {
          data: powerValues.map(power => power / 10), // Scale for better visualization
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  };

  const getBarChartData = () => {
    if (voltageData.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }]
      };
    }

    const labels = voltageData.map((reading, index) => {
      const timestamp = new Date(reading.timestamp);
      if (selectedFilter === 'daily') {
        return `${timestamp.getHours()}:00`;
      } else if (selectedFilter === 'weekly') {
        return timestamp.toLocaleDateString('en-US', { weekday: 'short' });
      } else {
        return timestamp.getDate().toString();
      }
    });

    return {
      labels,
      datasets: [
        {
          data: voltageData.map(reading => reading.power || 0),
        },
      ],
    };
  };

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      {(['daily', 'weekly', 'monthly'] as TimeFilter[]).map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterButton,
            {
              backgroundColor: selectedFilter === filter ? theme.colors.primary : theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
          onPress={() => setSelectedFilter(filter)}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: selectedFilter === filter ? theme.colors.surface : theme.colors.text },
            ]}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSummaryCards = () => {
    if (voltageData.length === 0) {
      return (
        <View style={styles.summaryContainer}>
          <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>No data available</Text>
        </View>
      );
    }
    
    const avgVoltage = voltageData.reduce((sum, reading) => sum + reading.voltage, 0) / voltageData.length;
    const avgCurrent = voltageData.reduce((sum, reading) => sum + reading.current, 0) / voltageData.length;
    const avgPower = voltageData.reduce((sum, reading) => sum + reading.power, 0) / voltageData.length;
    const maxPower = Math.max(...voltageData.map(reading => reading.power));

    return (
      <View style={styles.summaryContainer}>
                 <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
           <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Avg Voltage</Text>
           <Text style={[styles.summaryValue, { color: theme.colors.primary }]}>{avgVoltage.toFixed(1)}V</Text>
         </View>
         <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
           <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Avg Current</Text>
           <Text style={[styles.summaryValue, { color: theme.colors.secondary }]}>{avgCurrent.toFixed(2)}A</Text>
         </View>
         <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
           <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Avg Power</Text>
           <Text style={[styles.summaryValue, { color: '#4CAF50' }]}>{avgPower.toFixed(0)}W</Text>
         </View>
         <View style={[styles.summaryCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
           <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Peak Power</Text>
           <Text style={[styles.summaryValue, { color: '#FF9800' }]}>{maxPower.toFixed(0)}W</Text>
         </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Voltage Monitoring</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderFilterButtons()}
        {renderSummaryCards()}

                 <View style={[styles.chartContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
           <Text style={[styles.chartTitle, { color: theme.colors.text }]}>Voltage, Current & Power Trends</Text>
           {(() => {
             try {
               const chartData = getChartData();
               if (!chartData.labels || !chartData.datasets || chartData.datasets.length === 0) {
                 throw new Error('Invalid chart data');
               }
               return (
                 <LineChart
                   data={chartData}
                   width={width - 40}
                   height={220}
                   yAxisLabel=""
                   yAxisSuffix=""
                   withVerticalLines={false}
                   withHorizontalLines={true}
                   chartConfig={{
                     backgroundColor: 'transparent',
                     backgroundGradientFrom: theme.colors.surface,
                     backgroundGradientTo: theme.colors.surface,
                     decimalPlaces: 1,
                     color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                     labelColor: (opacity = 1) => theme.colors.textSecondary,
                     propsForDots: {
                       r: '3',
                       strokeWidth: '1',
                       stroke: theme.colors.primary,
                     },
                     propsForBackgroundLines: {
                       strokeDasharray: '',
                     },
                     useShadowColorFromDataset: false,
                   }}
                   bezier
                   style={styles.chart}
                 />
               );
             } catch (error) {
               return (
                 <View style={{ height: 220, justifyContent: 'center', alignItems: 'center' }}>
                   <Text style={{ color: theme.colors.textSecondary }}>Chart loading...</Text>
                 </View>
               );
             }
           })()}
                     <View style={styles.legend}>
             <View style={styles.legendItem}>
               <View style={[styles.legendColor, { backgroundColor: theme.colors.primary }]} />
               <Text style={[styles.legendText, { color: theme.colors.text }]}>Voltage (V)</Text>
             </View>
             <View style={styles.legendItem}>
               <View style={[styles.legendColor, { backgroundColor: theme.colors.secondary }]} />
               <Text style={[styles.legendText, { color: theme.colors.text }]}>Current (A)</Text>
             </View>
             <View style={styles.legendItem}>
               <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
               <Text style={[styles.legendText, { color: theme.colors.text }]}>Power (W)</Text>
             </View>
           </View>
        </View>

                 <View style={[styles.chartContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
           <Text style={[styles.chartTitle, { color: theme.colors.text }]}>Power Consumption</Text>
           {(() => {
             try {
               return (
                 <BarChart
                   data={getBarChartData()}
                   width={width - 40}
                   height={220}
                   showValuesOnTopOfBars={true}
                   withInnerLines={false}
                   fromZero={true}
                   chartConfig={{
                     backgroundColor: 'transparent',
                     backgroundGradientFrom: theme.colors.surface,
                     backgroundGradientTo: theme.colors.surface,
                     decimalPlaces: 0,
                     color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                     labelColor: (opacity = 1) => theme.colors.textSecondary,
                     barPercentage: 0.7,
                     propsForBackgroundLines: {
                       strokeDasharray: '',
                     },
                   }}
                   style={styles.chart}
                   showValuesOnTopOfBars
                 />
               );
             } catch (error) {
               return (
                 <View style={{ height: 220, justifyContent: 'center', alignItems: 'center' }}>
                   <Text style={{ color: theme.colors.textSecondary }}>Chart loading...</Text>
                 </View>
               );
             }
           })()}
         </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  filterButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
  },
});

export default GraphsScreen;
