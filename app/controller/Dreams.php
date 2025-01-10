<?php
declare (strict_types = 1);

namespace app\controller;

use think\Request;
use think\facade\Filesystem;
use think\Response;

class Dreams
{
    /**
     * 处理图片上传
     */
    public function uploadImage(Request $request)
    {
        try {
            // 1. 获取上传的文件
            $file = $request->file('file');
            if (!$file) {
                return json(['code' => 400, 'message' => '没有上传文件']);
            }

            // 2. 创建存储目录（按年月组织）
            $yearMonth = date('Y-m');
            $savePath = 'uploads/dreams/generated/' . $yearMonth;
            $publicPath = public_path() . $savePath;
            if (!is_dir($publicPath)) {
                mkdir($publicPath, 0755, true);
            }

            // 3. 验证文件
            validate(['file' => [
                'fileSize' => 20 * 1024 * 1024, // 20MB
                'fileExt' => ['jpg', 'jpeg', 'png', 'gif'],
                'fileMime' => ['image/jpeg', 'image/png', 'image/gif'],
            ]])->check(['file' => $file]);

            // 4. 保存文件
            $saveName = md5(uniqid()) . '.' . $file->getOriginalExtension();
            $file->move($publicPath, $saveName);

            // 5. 生成访问URL
            $url = request()->domain() . '/' . $savePath . '/' . $saveName;

            return json([
                'code' => 200,
                'message' => '上传成功',
                'url' => $url
            ]);

        } catch (\think\exception\ValidateException $e) {
            return json(['code' => 400, 'message' => $e->getMessage()]);
        } catch (\Exception $e) {
            return json(['code' => 500, 'message' => '上传失败：' . $e->getMessage()]);
        }
    }

    /**
     * 生成图片
     */
    public function generateImage(Request $request): Response
    {
        try {
            $data = json_decode(file_get_contents('php://input'), true);
            $prompt = $data['prompt'] ?? '';
            if (empty($prompt)) {
                return json(['error' => '梦境描述不能为空']);
            }

            // 腾讯云API配置
            $secretId = getenv('HUNYUAN_SECRET_ID');
            $secretKey = getenv('HUNYUAN_SECRET_KEY');
            $region = "ap-guangzhou";
            $endpoint = "hunyuan.tencentcloudapi.com";

            // 准备请求参数
            $params = [
                'Prompt' => $prompt,
                'RspImgType' => 'url'
            ];

            // 发送请求到腾讯云
            $result = $this->callTencentAPI($secretId, $secretKey, $region, $endpoint, $params);

            return json($result);
        } catch (\Exception $e) {
            return json([
                'error' => '生成图片失败',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function callTencentAPI($secretId, $secretKey, $region, $endpoint, $params)
    {
        $timestamp = time();
        $date = gmdate('Y-m-d', $timestamp);

        // 1. 准备签名所需参数
        $algorithm = "TC3-HMAC-SHA256";
        $service = "hunyuan";
        $action = "TextToImageLite";
        $version = "2023-09-01";
        $credentialScope = $date . "/" . $service . "/tc3_request";

        // 2. 准备规范请求串
        $httpRequestMethod = "POST";
        $canonicalUri = "/";
        $canonicalQueryString = "";
        $payload = json_encode($params);
        $hashedRequestPayload = hash("SHA256", $payload);

        $canonicalHeaders = "content-type:application/json\n"
            . "host:" . $endpoint . "\n"
            . "x-tc-action:" . strtolower($action) . "\n";
        $signedHeaders = "content-type;host;x-tc-action";

        $canonicalRequest = $httpRequestMethod . "\n"
            . $canonicalUri . "\n"
            . $canonicalQueryString . "\n"
            . $canonicalHeaders . "\n"
            . $signedHeaders . "\n"
            . $hashedRequestPayload;

        // 3. 准备待签名字符串
        $hashedCanonicalRequest = hash("SHA256", $canonicalRequest);
        $stringToSign = $algorithm . "\n"
            . $timestamp . "\n"
            . $credentialScope . "\n"
            . $hashedCanonicalRequest;

        // 4. 计算签名
        $secretDate = hash_hmac("SHA256", $date, "TC3" . $secretKey, true);
        $secretService = hash_hmac("SHA256", $service, $secretDate, true);
        $secretSigning = hash_hmac("SHA256", "tc3_request", $secretService, true);
        $signature = hash_hmac("SHA256", $stringToSign, $secretSigning);

        // 5. 组装授权信息
        $authorization = $algorithm
            . " Credential=" . $secretId . "/" . $credentialScope
            . ", SignedHeaders=" . $signedHeaders
            . ", Signature=" . $signature;

        // 6. 发送请求
        $ch = curl_init("https://" . $endpoint);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $httpRequestMethod);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: " . $authorization,
            "Content-Type: application/json",
            "Host: " . $endpoint,
            "X-TC-Action: " . $action,
            "X-TC-Timestamp: " . $timestamp,
            "X-TC-Version: " . $version,
            "X-TC-Region: " . $region
        ]);

        $response = curl_exec($ch);
        if (curl_errno($ch)) {
            throw new \Exception(curl_error($ch));
        }
        curl_close($ch);

        return json_decode($response, true);
    }
} 