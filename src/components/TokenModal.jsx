import {
  Box,
  Modal,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TokenPriceChart from "./TokenPriceChart";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { coinGeckoService } from "../services/coinGeckoService";
import { cacheService } from "../services/cacheService";

const ModalContent = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 600,
  backgroundColor: "#1A1C24",
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  outline: "none",
}));

const Header = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(2),
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
}));

const TokenInfo = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const Stats = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
}));

const StatItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(0.5),
}));

const Links = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
}));

const TimeFrames = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  padding: theme.spacing(2),
}));

const TokenModal = ({ open, onClose, token }) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("Day");
  const [tokenData, setTokenData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const storedData = cacheService.get("bubbleData");
    const tokenInfo = storedData?.find((t) => t.id === token.id);

    if (tokenInfo) {
      setTokenData({
        name: tokenInfo.name,
        symbol: tokenInfo.symbol.toUpperCase(),
        image: tokenInfo.image,
        marketCap: tokenInfo.market_cap,
        rank: tokenInfo.market_cap_rank,
        currentPrice: tokenInfo.current_price,
        priceChange: {
          hour: tokenInfo.price_change_percentage_1h_in_currency?.usd || 0,
          day: tokenInfo.price_change_percentage_24h || 0,
          week: tokenInfo.price_change_percentage_7d || 0,
          month: tokenInfo.price_change_percentage_30d || 0,
          year: tokenInfo.price_change_percentage_1y || 0,
        },
        links: tokenInfo.links || {},
      });
    }
  }, [token]);

  // Clear cache when modal closes
  useEffect(() => {
    if (!open) {
      setTokenData(null);
      setSelectedTimeFrame("Day");
    }
  }, [open]);

  if (!open || !token) return null;

  const getPriceChangeColor = (change) => {
    return change >= 0 ? "#4ADE80" : "#EF4444";
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="token-modal"
      BackdropProps={{
        style: { backgroundColor: "rgba(0, 0, 0, 0.8)" },
      }}
    >
      <ModalContent>
        {tokenData ? (
          <>
            <Header>
              <TokenInfo>
                <Box
                  component="img"
                  src={token.image}
                  alt={token.symbol}
                  sx={{ width: 32, height: 32, borderRadius: "50%" }}
                />
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ color: "white", fontWeight: 600 }}
                  >
                    {token.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                  >
                    {token.symbol.toUpperCase()}
                  </Typography>
                </Box>
              </TokenInfo>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#2563EB", "&:hover": { bgcolor: "#1D4ED8" } }}
                >
                  Trade
                </Button>
                <Button
                  onClick={onClose}
                  sx={{ color: "rgba(255, 255, 255, 0.6)" }}
                >
                  ✕
                </Button>
              </Box>
            </Header>

            <Stats>
              <StatItem>
                <Typography sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  Rank
                </Typography>
                <Typography sx={{ color: "white", fontWeight: 600 }}>
                  #{tokenData.rank}
                </Typography>
              </StatItem>
              <StatItem>
                <Typography sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
                  Market Cap
                </Typography>
                <Typography sx={{ color: "white", fontWeight: 600 }}>
                  ${(tokenData.marketCap / 1e9).toFixed(2)}B
                </Typography>
              </StatItem>
            </Stats>

            <Links>
              {tokenData.links &&
                Object.entries(tokenData.links).map(
                  ([key, url]) =>
                    url && (
                      <Button
                        key={key}
                        variant="outlined"
                        size="small"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderColor: "rgba(255, 255, 255, 0.1)",
                          color: "white",
                          "&:hover": { borderColor: "white" },
                        }}
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Button>
                    )
                )}
            </Links>

            <TimeFrames>
              {Object.entries({
                Hour: tokenData.priceChange.hour,
                Day: tokenData.priceChange.day,
                Week: tokenData.priceChange.week,
                Month: tokenData.priceChange.month,
                Year: tokenData.priceChange.year,
              }).map(([timeFrame, change]) => (
                <Button
                  key={timeFrame}
                  variant="text"
                  onClick={() => setSelectedTimeFrame(timeFrame)}
                  sx={{
                    color:
                      selectedTimeFrame === timeFrame ? "#2563EB" : "white",
                    minWidth: "unset",
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.5,
                    "&:hover": { backgroundColor: "rgba(37, 99, 235, 0.1)" },
                  }}
                >
                  <span>{timeFrame}</span>
                  <Typography
                    variant="caption"
                    sx={{
                      color: getPriceChangeColor(change),
                      fontWeight: "bold",
                    }}
                  >
                    {change.toFixed(1)}%
                  </Typography>
                </Button>
              ))}
            </TimeFrames>

            <Box sx={{ p: 2, height: 300 }}>
              <TokenPriceChart
                tokenId={token.id}
                timeFrame={selectedTimeFrame.toLowerCase()}
              />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 400,
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: "#2563EB" }} />
            <Typography sx={{ color: "white" }}>
              Loading token data...
            </Typography>
          </Box>
        )}
      </ModalContent>
    </Modal>
  );
};

TokenModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  token: PropTypes.shape({
    id: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default TokenModal;
