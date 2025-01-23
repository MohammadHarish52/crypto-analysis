import { useEffect, useState } from "react";
import { Paper, Typography, Button, Box, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2.5),
  backgroundColor: "transparent",
  border: `1px solid ${theme.palette.grey[900]}`,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    borderColor: theme.palette.primary.main,
    boxShadow: `0 4px 20px ${theme.palette.primary.main}15`,
  },
}));

const RiskChip = styled(Chip)(({ theme, risk }) => ({
  backgroundColor:
    risk <= 3
      ? theme.palette.success.main
      : risk <= 6
      ? theme.palette.warning.main
      : theme.palette.error.main,
  color: theme.palette.common.white,
  fontWeight: 500,
  fontSize: "0.75rem",
  height: "24px",
}));

const getRiskColor = (risk) => {
  if (risk <= 3) return "#4ADE80"; // Green for low risk
  if (risk <= 6) return "#F59E0B"; // Yellow for medium risk
  return "#EF4444"; // Red for high risk
};

const SignalsList = ({ timeFrame }) => {
  const [signals, setSignals] = useState([]);
  const theme = useTheme();

  // Mock data - replace with your actual API call
  useEffect(() => {
    const mockSignals = [
      { symbol: "BTC", risk: 4, marketCap: "$1.2B", time: "15m ago" },
      { symbol: "ETH", risk: 3, marketCap: "$800M", time: "1h ago" },
      { symbol: "SOL", risk: 5, marketCap: "$400M", time: "2h ago" },
    ];
    setSignals(mockSignals);
  }, [timeFrame]);

  return (
    <Box sx={{ height: "100%" }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: "#4ADE80", mb: 1 }}>
            The Good
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            4 cycles are at the bottom
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" sx={{ color: "#EF4444", mb: 1 }}>
            The Bad
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            3-Day Cycle is falling, can indicate further downside
          </Typography>
        </Box>
      </Box>

      <Typography variant="h6" sx={{ mb: 3 }}>
        Latest Signals
      </Typography>

      <Box sx={{ mb: 4 }}>
        {signals.map((signal) => (
          <Paper
            key={signal.symbol}
            sx={{
              mb: 2,
              p: 2,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="h6">${signal.symbol}</Typography>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {signal.time}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Chip
                label={`Risk ${signal.risk}/10`}
                size="small"
                sx={{
                  backgroundColor: getRiskColor(signal.risk),
                  color: "white",
                }}
              />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                MCap: {signal.marketCap}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      <Box sx={{ mt: "auto" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Premium Signals
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Get early access to all buy signals and advanced analytics
        </Typography>
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            py: 1.5,
            backgroundColor: "#3B82F6",
            "&:hover": {
              backgroundColor: "#2563EB",
            },
          }}
        >
          Subscribe Now
        </Button>
      </Box>
    </Box>
  );
};

export default SignalsList;
