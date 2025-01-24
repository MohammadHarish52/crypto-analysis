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
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          fontSize: "1.5rem",
        }}
      >
        Latest Buy Signals
      </Typography>

      <Box sx={{ mb: 4 }}>
        {[1, 2, 3].map((_, index) => (
          <Box
            key={index}
            sx={{
              mb: 2,
              p: 2,
              backgroundColor: "rgba(17, 17, 17, 0.6)",
              borderRadius: 2,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6" sx={{ color: "#fff" }}>
                  $SOL | $243.80
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.5)",
                    alignSelf: "flex-start",
                  }}
                >
                  15m ago
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <Chip
                label="Risk 4/10"
                size="small"
                sx={{
                  backgroundColor: "#F59E0B",
                  color: "white",
                  height: "24px",
                  fontSize: "0.75rem",
                }}
              />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                Market Cap: $1.2B
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          mt: "auto",
          backgroundColor: "rgba(17, 17, 17, 0.6)",
          borderRadius: 2,
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Typography variant="h6">Premium Signals</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              $49
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              /month
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
          Get early access to all buy signals and advanced analytics
        </Typography>
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            py: 1.5,
            backgroundColor: "#2563EB",
            "&:hover": {
              backgroundColor: "#1D4ED8",
            },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Subscribe Now
        </Button>
      </Box>
    </Box>
  );
};

export default SignalsList;
