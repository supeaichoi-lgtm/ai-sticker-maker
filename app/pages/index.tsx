import { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { createRoute } from "@granite-js/react-native";
import { Button, Text, TextField } from "@toss/tds-react-native";
import { baseURL } from "config/api";

type StickerResponse = {
  dataUrl: string;
};

export const Route = createRoute("/", {
  validateParams: (params) => params,
  component: Index,
});

export function Index() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed) {
      setError("먼저 단어나 문장을 입력해 주세요.");
      return;
    }

    setError(null);
    setLoading(true);
    setImage(null);

    try {
      const res = await fetch(`${baseURL}/api/sticker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: trimmed }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error ?? `요청에 실패했어요. (status ${res.status})`);
      }

      const body = (await res.json()) as StickerResponse;
      setImage(body.dataUrl);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "알 수 없는 오류가 발생했어요.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text typography="st5" fontWeight="extraBold" style={styles.title}>
        AI 스티커 만들기
      </Text>
      <Text typography="pt2" style={styles.description}>
        예: 고양이, 웃는 토끼, 파란 로고 스티커 처럼{"\n"}
        만들고 싶은 스티커를 간단히 적어 보세요.
      </Text>
      <TextField
        containerStyle={styles.textfieldContainer}
        style={styles.textfield}
        variant="box"
        placeholder="원하는 스티커를 설명해 주세요."
        value={prompt}
        onChangeText={setPrompt}
        multiline
      />
      {error && (
        <Text typography="cp2" style={styles.error}>
          {error}
        </Text>
      )}
      <Button
        viewStyle={styles.button}
        loading={loading}
        disabled={loading}
        onPress={handleGenerate}
      >
        스티커 만들기
      </Button>
      {image && (
        <View style={styles.previewContainer}>
          <Text typography="cp1" style={styles.previewLabel}>
            생성된 스티커
          </Text>
          <View style={styles.previewBox}>
            <Image
              source={{ uri: image }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    marginTop: 10,
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
  },
  textfieldContainer: {
    paddingHorizontal: 0,
  },
  textfield: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  button: {
    marginTop: 16,
  },
  error: {
    marginTop: 8,
    color: "#E02020",
  },
  previewContainer: {
    marginTop: 24,
  },
  previewLabel: {
    marginBottom: 8,
  },
  previewBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E8EB",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  previewImage: {
    width: 200,
    height: 200,
  },
});

