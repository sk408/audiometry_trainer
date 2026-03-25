import React, { useState, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Button,
  Chip,
  useMediaQuery,
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Assessment as AssessmentIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  SchoolOutlined,
  Person as PersonIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LabelList,
} from 'recharts';
import progressService, { ProgressRecord } from '../services/ProgressService';

// --- Helpers ---

function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return `${Math.round(totalSeconds)}s`;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 90) return '#4caf50';
  if (accuracy > 75) return '#2196f3';
  if (accuracy > 60) return '#ff9800';
  return '#f44336';
}

function getAccuracyLabel(accuracy: number): string {
  if (accuracy >= 90) return 'Excellent';
  if (accuracy > 75) return 'Good';
  if (accuracy > 60) return 'Fair';
  return 'Needs Work';
}

type SortKey = 'date' | 'patientName' | 'hearingLossType' | 'difficulty' | 'accuracy' | 'timeSpent';
type SortDirection = 'asc' | 'desc';

// --- Component ---

const ProgressPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Data from service
  const totalSessions = progressService.getTotalSessions();
  const averageAccuracy = progressService.getAverageAccuracy();
  const totalTime = progressService.getTotalTimeSpent();
  const trendData = progressService.getImprovementTrend();
  const accuracyByType = progressService.getAccuracyByHearingLossType();
  const recentSessions = progressService.getRecentSessions(20);

  // Sorting state for the table
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Compute improvement trend direction
  const trendDirection = useMemo(() => {
    if (trendData.length < 4) return 'flat';
    const half = Math.floor(trendData.length / 2);
    const olderHalf = trendData.slice(0, half);
    const newerHalf = trendData.slice(half);
    const olderAvg = olderHalf.reduce((a, b) => a + b, 0) / olderHalf.length;
    const newerAvg = newerHalf.reduce((a, b) => a + b, 0) / newerHalf.length;
    const diff = newerAvg - olderAvg;
    if (diff > 3) return 'up';
    if (diff < -3) return 'down';
    return 'flat';
  }, [trendData]);

  // Chart data
  const lineChartData = trendData.map((accuracy, index) => ({
    session: index + 1,
    accuracy: Math.round(accuracy * 10) / 10,
  }));

  const barChartData = Object.entries(accuracyByType)
    .map(([type, data]) => ({
      type,
      avgAccuracy: Math.round(data.avgAccuracy * 10) / 10,
      count: data.count,
    }))
    .sort((a, b) => b.avgAccuracy - a.avgAccuracy);

  // Sorted sessions
  const sortedSessions = useMemo(() => {
    const sorted = [...recentSessions];
    sorted.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'date':
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'patientName':
          cmp = a.patientName.localeCompare(b.patientName);
          break;
        case 'hearingLossType':
          cmp = a.hearingLossType.localeCompare(b.hearingLossType);
          break;
        case 'difficulty':
          cmp = a.difficulty.localeCompare(b.difficulty);
          break;
        case 'accuracy':
          cmp = a.accuracy - b.accuracy;
          break;
        case 'timeSpent':
          cmp = a.timeSpent - b.timeSpent;
          break;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [recentSessions, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection(key === 'date' ? 'desc' : 'asc');
    }
  };

  // --- Empty State ---
  if (totalSessions === 0) {
    return (
      <Box>
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            py: { xs: 4, md: 6 },
            textAlign: 'center',
          }}
        >
          <Container maxWidth="md">
            <AssessmentIcon sx={{ fontSize: { xs: 40, md: 56 }, mb: 2 }} />
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              fontWeight="bold"
              sx={{ fontSize: { xs: '1.75rem', md: '3rem' } }}
            >
              Progress Dashboard
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontSize: { xs: '0.95rem', md: '1.25rem' } }}>
              Track your audiometry testing performance over time
            </Typography>
          </Container>
        </Box>

        <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: alpha(theme.palette.primary.main, 0.02),
            }}
          >
            <SchoolOutlined sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight={600}>
              No Sessions Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 360, mx: 'auto' }}>
              Complete your first audiometry testing session to start tracking your progress and improvement over time.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<PersonIcon />}
              component={RouterLink}
              to="/patients"
              sx={{ px: 4, py: 1.5 }}
            >
              Start Practicing
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  // --- Main Dashboard ---
  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: { xs: 4, md: 6 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <AssessmentIcon sx={{ fontSize: { xs: 40, md: 56 }, mb: 2 }} />
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
            sx={{ fontSize: { xs: '1.75rem', md: '3rem' } }}
          >
            Progress Dashboard
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, fontSize: { xs: '0.95rem', md: '1.25rem' } }}>
            Track your audiometry testing performance over time
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Summary Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Sessions */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <SchoolOutlined sx={{ fontSize: 28, color: 'primary.main' }} />
              </Box>
              <Typography variant="h3" fontWeight={700} color="text.primary">
                {totalSessions}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Total Sessions
              </Typography>
            </Paper>
          </Grid>

          {/* Average Accuracy */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: alpha(getAccuracyColor(averageAccuracy), 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <TrophyIcon sx={{ fontSize: 28, color: getAccuracyColor(averageAccuracy) }} />
              </Box>
              <Typography variant="h3" fontWeight={700} sx={{ color: getAccuracyColor(averageAccuracy) }}>
                {Math.round(averageAccuracy)}%
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Average Accuracy
              </Typography>
              <Chip
                label={getAccuracyLabel(averageAccuracy)}
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: alpha(getAccuracyColor(averageAccuracy), 0.1),
                  color: getAccuracyColor(averageAccuracy),
                  fontWeight: 600,
                }}
              />
            </Paper>
          </Grid>

          {/* Total Practice Time */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <TimerIcon sx={{ fontSize: 28, color: 'info.main' }} />
              </Box>
              <Typography variant="h3" fontWeight={700} color="text.primary">
                {formatDuration(totalTime)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Total Practice Time
              </Typography>
            </Paper>
          </Grid>

          {/* Improvement Trend */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: alpha(
                    trendDirection === 'up'
                      ? theme.palette.success.main
                      : trendDirection === 'down'
                        ? theme.palette.error.main
                        : theme.palette.warning.main,
                    0.1
                  ),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                {trendDirection === 'up' && (
                  <TrendingUpIcon sx={{ fontSize: 28, color: 'success.main' }} />
                )}
                {trendDirection === 'down' && (
                  <TrendingDownIcon sx={{ fontSize: 28, color: 'error.main' }} />
                )}
                {trendDirection === 'flat' && (
                  <TrendingFlatIcon sx={{ fontSize: 28, color: 'warning.main' }} />
                )}
              </Box>
              <Typography
                variant="h3"
                fontWeight={700}
                sx={{
                  color:
                    trendDirection === 'up'
                      ? 'success.main'
                      : trendDirection === 'down'
                        ? 'error.main'
                        : 'warning.main',
                }}
              >
                {trendDirection === 'up' ? 'Improving' : trendDirection === 'down' ? 'Declining' : 'Steady'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Performance Trend
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts Row */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Accuracy Trend Chart */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
              }}
            >
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Accuracy Trend
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Your accuracy over the last {trendData.length} sessions
              </Typography>
              {trendData.length >= 2 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={alpha(theme.palette.text.primary, 0.1)}
                    />
                    <XAxis
                      dataKey="session"
                      label={{ value: 'Session', position: 'insideBottomRight', offset: -5 }}
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                      stroke={alpha(theme.palette.text.primary, 0.2)}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                      stroke={alpha(theme.palette.text.primary, 0.2)}
                      label={{
                        value: 'Accuracy %',
                        angle: -90,
                        position: 'insideLeft',
                        style: { fill: theme.palette.text.secondary },
                      }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                        boxShadow: theme.shadows[4],
                      }}
                      labelStyle={{ color: theme.palette.text.primary }}
                      formatter={(value: number) => [`${value}%`, 'Accuracy']}
                      labelFormatter={(label: number) => `Session ${label}`}
                    />
                    <ReferenceLine
                      y={80}
                      stroke={theme.palette.success.main}
                      strokeDasharray="6 4"
                      strokeWidth={1.5}
                      label={{
                        value: '80% Target',
                        position: 'right',
                        fill: theme.palette.success.main,
                        fontSize: 11,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke={theme.palette.primary.main}
                      strokeWidth={2.5}
                      dot={{
                        fill: theme.palette.primary.main,
                        r: 4,
                        strokeWidth: 2,
                        stroke: theme.palette.background.paper,
                      }}
                      activeDot={{
                        r: 6,
                        fill: theme.palette.primary.main,
                        stroke: theme.palette.background.paper,
                        strokeWidth: 2,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography color="text.secondary">
                    Complete at least 2 sessions to see trend data
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Accuracy by Hearing Loss Type */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
              }}
            >
              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Accuracy by Hearing Loss Type
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Average accuracy per condition
              </Typography>
              {barChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={barChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 60, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={alpha(theme.palette.text.primary, 0.1)}
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                      stroke={alpha(theme.palette.text.primary, 0.2)}
                    />
                    <YAxis
                      type="category"
                      dataKey="type"
                      width={isMobile ? 80 : 120}
                      tick={{ fill: theme.palette.text.secondary, fontSize: 11 }}
                      stroke={alpha(theme.palette.text.primary, 0.2)}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                        boxShadow: theme.shadows[4],
                      }}
                      formatter={(value: number, _name: string, item: { payload?: { count?: number } }) => {
                        const count = item?.payload?.count ?? 0;
                        return [
                          `${value}% (${count} session${count !== 1 ? 's' : ''})`,
                          'Avg Accuracy',
                        ] as [string, string];
                      }}
                    />
                    <Bar dataKey="avgAccuracy" radius={[0, 6, 6, 0]} barSize={24}>
                      {barChartData.map((entry, index) => (
                        <Cell key={index} fill={getAccuracyColor(entry.avgAccuracy)} />
                      ))}
                      <LabelList
                        dataKey="avgAccuracy"
                        position="right"
                        formatter={(value: number) => `${value}%`}
                        style={{ fill: theme.palette.text.secondary, fontSize: 11, fontWeight: 600 }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  sx={{
                    height: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Sessions Table */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 3, pb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Recent Sessions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your last {recentSessions.length} testing sessions
            </Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.04),
                  }}
                >
                  <TableCell>
                    <TableSortLabel
                      active={sortKey === 'date'}
                      direction={sortKey === 'date' ? sortDirection : 'desc'}
                      onClick={() => handleSort('date')}
                    >
                      Date
                    </TableSortLabel>
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <TableSortLabel
                        active={sortKey === 'patientName'}
                        direction={sortKey === 'patientName' ? sortDirection : 'asc'}
                        onClick={() => handleSort('patientName')}
                      >
                        Patient
                      </TableSortLabel>
                    </TableCell>
                  )}
                  <TableCell>
                    <TableSortLabel
                      active={sortKey === 'hearingLossType'}
                      direction={sortKey === 'hearingLossType' ? sortDirection : 'asc'}
                      onClick={() => handleSort('hearingLossType')}
                    >
                      Type
                    </TableSortLabel>
                  </TableCell>
                  {!isMobile && (
                    <TableCell>
                      <TableSortLabel
                        active={sortKey === 'difficulty'}
                        direction={sortKey === 'difficulty' ? sortDirection : 'asc'}
                        onClick={() => handleSort('difficulty')}
                      >
                        Difficulty
                      </TableSortLabel>
                    </TableCell>
                  )}
                  <TableCell align="center">
                    <TableSortLabel
                      active={sortKey === 'accuracy'}
                      direction={sortKey === 'accuracy' ? sortDirection : 'asc'}
                      onClick={() => handleSort('accuracy')}
                    >
                      Accuracy
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortKey === 'timeSpent'}
                      direction={sortKey === 'timeSpent' ? sortDirection : 'asc'}
                      onClick={() => handleSort('timeSpent')}
                    >
                      Duration
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedSessions.map((session: ProgressRecord) => {
                  const date = new Date(session.date);
                  const formattedDate = date.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });
                  const formattedTime = date.toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  });
                  const accColor = getAccuracyColor(session.accuracy);

                  return (
                    <TableRow
                      key={session.sessionId}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {formattedDate}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formattedTime}
                        </Typography>
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Typography variant="body2">{session.patientName}</Typography>
                        </TableCell>
                      )}
                      <TableCell>
                        <Chip
                          label={session.hearingLossType}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      {!isMobile && (
                        <TableCell>
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {session.difficulty}
                          </Typography>
                        </TableCell>
                      )}
                      <TableCell align="center">
                        <Chip
                          label={`${Math.round(session.accuracy)}%`}
                          size="small"
                          sx={{
                            bgcolor: alpha(accColor, 0.1),
                            color: accColor,
                            fontWeight: 700,
                            minWidth: 56,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDuration(session.timeSpent)}</Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProgressPage;
