import { useEffect, useState } from "react";
import { Paper, Typography, Button, Box, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { cacheService } from "../services/cacheService";

const MAX_NOTIFICATIONS = 25;

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

const WalletButton = styled(WalletMultiButton)(({ theme }) => ({
  backgroundColor: "#2563EB",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  width: "100%",
  textAlign: "center",
  "&:hover": {
    backgroundColor: "#1D4ED8",
  },
  "& .wallet-adapter-button-trigger": {
    background: "none",
  },
}));

const SidebarContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "#000",
  [theme.breakpoints.up("md")]: {
    position: "fixed",
    right: 0,
    top: 0,
    width: "380px",
    height: "100vh",
    borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
  },
}));

const TopSection = styled(Box)(({ theme }) => ({
  padding: "12px 24px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
}));

const SignalCard = styled(Box)(({ riskLevel }) => ({
  marginBottom: "16px",
  padding: "16px",
  width: "100%",
  backgroundColor: riskLevel <= 30 ? "#004400" : "#440000",
  borderRadius: "16px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const getRiskColor = (risk) => {
  if (risk <= 3) return "#4ADE80"; // Green for low risk
  if (risk <= 6) return "#F59E0B"; // Yellow for medium risk
  return "#EF4444"; // Red for high risk
};

const SignalsList = ({ timeFrame }) => {
  const [signals, setSignals] = useState([]);
  const theme = useTheme();
  const { publicKey, connected } = useWallet();

  const calculateRiskLevel = (token) => {
    // Calculate risk based on various factors
    const priceChange = token.price_change_percentage_24h || 0;
    const marketCap = token.market_cap || 0;
    const volume = token.total_volume || 0;

    let risk = 50; // Base risk

    // Adjust risk based on price change
    if (Math.abs(priceChange) > 20) risk += 20;
    else if (Math.abs(priceChange) > 10) risk += 10;

    // Adjust risk based on market cap
    if (marketCap > 1000000000) risk -= 15; // Lower risk for high market cap
    if (marketCap < 100000000) risk += 15; // Higher risk for low market cap

    // Adjust risk based on volume
    if (volume > marketCap * 0.1) risk -= 10; // Good volume
    if (volume < marketCap * 0.01) risk += 10; // Low volume

    return Math.min(Math.max(risk, 0), 100); // Ensure risk is between 0 and 100
  };

  const generateSignals = () => {
    const storedData = cacheService.get("bubbleData");
    if (!storedData) return [];

    return storedData
      .map((token) => ({
        ...token,
        riskLevel: calculateRiskLevel(token),
        timestamp: Date.now(),
      }))
      .sort((a, b) => {
        // Sort by a combination of risk level and price change
        const aScore =
          (100 - a.riskLevel) * Math.abs(a.price_change_percentage_24h || 0);
        const bScore =
          (100 - b.riskLevel) * Math.abs(b.price_change_percentage_24h || 0);
        return bScore - aScore;
      })
      .slice(0, MAX_NOTIFICATIONS);
  };

  useEffect(() => {
    const newSignals = generateSignals();
    setSignals(newSignals);

    // Refresh signals every 2 minutes
    const interval = setInterval(() => {
      const updatedSignals = generateSignals();
      setSignals(updatedSignals);
    }, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [timeFrame]);

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toFixed(2)}`;
  };

  return (
    <SidebarContainer>
      <TopSection>
        <WalletButton>
          {connected ? (
            <span>
              {publicKey?.toString().slice(0, 4)}...
              {publicKey?.toString().slice(-4)}
            </span>
          ) : (
            <span>Connect Wallet</span>
          )}
        </WalletButton>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#2563EB",
            color: "white",
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              backgroundColor: "#1D4ED8",
            },
          }}
        >
          Premium
        </Button>
      </TopSection>

      <Box sx={{ p: 3, flex: 1, overflowY: "auto" }}>
        <Typography
          variant="h5"
          sx={{
            mb: 3,
            fontWeight: 600,
            fontSize: "1.5rem",
            color: "#FFFFFF",
          }}
        >
          Latest Buy Signals
        </Typography>

        {signals.map((signal, index) => (
          <SignalCard
            key={`${signal.id}-${signal.timestamp}`}
            riskLevel={signal.riskLevel}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ color: "#FFFFFF", fontWeight: 600 }}
              >
                ${signal.symbol.toUpperCase()}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
              >
                {new Date(signal.timestamp).toLocaleTimeString()}
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: "#FFFFFF", fontWeight: 700, mt: 1 }}
              >
                ${signal.current_price.toFixed(2)}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "rgba(255, 255, 255, 0.8)", mt: 0.5 }}
              >
                Risk: <strong>{signal.riskLevel}/100</strong>
                <br />
                Market Cap:{" "}
                <strong>{formatMarketCap(signal.market_cap)}</strong>
                <br />
                24h Change:{" "}
                <strong
                  style={{
                    color:
                      signal.price_change_percentage_24h >= 0
                        ? "#4ADE80"
                        : "#EF4444",
                  }}
                >
                  {signal.price_change_percentage_24h.toFixed(2)}%
                </strong>
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 24,
                height: 24,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: "50%",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="white"
                width="16"
                height="16"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Box>
          </SignalCard>
        ))}
      </Box>
    </SidebarContainer>
  );
};

export default SignalsList;
