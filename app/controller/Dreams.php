<?php
declare (strict_types = 1);

namespace app\controller;

use think\Request;
use think\facade\Filesystem;

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
} 