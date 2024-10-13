import { useState, useEffect } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'
import { Star, Download, MessageSquare, ExternalLink, Copy, Eye } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

import { Resource } from '@/app/sys/add/types'
import { fetchResourceInfo } from '@/lib/api'
import ResourceSkeleton from './ResourceSkeleton'

interface ResourceDetailProps {
    uuid: string;
}

export default function ResourceDetail({ uuid }: ResourceDetailProps) {
    const [resource, setResource] = useState<Resource | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [selectedImage, setSelectedImage] = useState<string | null>(null)

    useEffect(() => {
        const fetchResource = async () => {
            try {
                const data = await fetchResourceInfo(uuid);
                setResource(data);
            } catch (error) {
                console.error('获取资源详情时出错:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchResource();
    }, [uuid]);

    if (loading) {
        return <ResourceSkeleton />;
    }

    if (!resource) {
        return <div className="text-center p-4">资源未找到</div>;
    }

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === resource.images.length - 1 ? 0 : prevIndex + 1
        )
    }

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? resource.images.length - 1 : prevIndex - 1
        )
    }

    const copyToClipboard = async (text: string, description: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({
                title: "已复制",
                description: description,
            });
        } catch (err) {
            console.error('复制失败:', err);
            toast({
                title: "复制失败",
                description: "请手动复制内容",
                variant: "destructive"
            });
        }
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">{resource.name}</CardTitle>
                    <p className="text-muted-foreground">{resource.category}</p>
                </CardHeader>
                <CardContent>
                    <div className="relative w-full h-[300px] mb-4 overflow-hidden">
                        <Image
                            src={resource.images[0]}
                            alt={`${resource.name} - 首图`}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {resource.tags.map((tag: any, index: number) => (
                            <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">网盘资源</h3>
                        {Object.entries(resource.source_links).map(([source, info]) => (
                            <Card key={source} className="mb-4 p-4">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium">{source}</p>
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                                    <div className="relative flex-grow group">
                                        <Input
                                            value={info.link}
                                            readOnly
                                            className="pr-10"
                                            onClick={() => copyToClipboard(info.link, "链接已复制到剪贴板")}
                                        />
                                        <Button
                                            className="absolute right-0 top-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => copyToClipboard(info.link, "链接已复制到剪贴板")}
                                            size="icon"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {info.psw && (
                                        <div className="relative w-24 group">
                                            <Input
                                                value={info.psw}
                                                readOnly
                                                className="pr-10"
                                                onClick={() => copyToClipboard(info.psw, "密码已复制到剪贴板")}
                                            />
                                            <Button
                                                className="absolute right-0 top-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => copyToClipboard(info.psw, "密码已复制到剪贴板")}
                                                size="icon"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    <p className="text-sm text-muted-foreground whitespace-nowrap">大小：{info.size}</p>
                                    <Button onClick={() => copyToClipboard(`链接：${info.link}\n密码：${info.psw || '无'}`, "链接和密码已复制到剪贴板")} size="icon"><Copy className="h-4 w-4" /></Button>
                                    <Button onClick={() => window.open(info.link, '_blank')} variant="outline" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">资源信息</h3>
                        <p>上传时间：{format(new Date(resource.uploaded), 'yyyy-MM-dd HH:mm:ss')}</p>
                        <p>更新时间：{format(new Date(resource.update_time), 'yyyy-MM-dd HH:mm:ss')}</p>
                        <p>官方链接：<a href={resource.link} className="text-blue-500 hover:underline flex items-center">
                            {resource.link} <ExternalLink className="h-4 w-4 ml-1" />
                        </a></p>
                        <div className="flex items-center mt-2">
                            <Star className="h-5 w-5 text-yellow-400 mr-1" />
                            <span>{resource.rating}</span>
                        </div>
                        <div className="flex items-center mt-2">
                            <MessageSquare className="h-5 w-5 mr-1" />
                            <span>{resource.comments} 评论</span>
                        </div>
                        <div className="flex items-center mt-2">
                            <Download className="h-5 w-5 mr-1" />
                            <span>{resource.download_count} 下载</span>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div>
                        <h3 className="text-lg font-semibold mb-2">简介</h3>
                        <p>{resource.introduction}</p>
                    </div>

                    <Separator className="my-4" />

                    <div>
                        <h3 className="text-lg font-semibold mb-2">资源信息</h3>
                        {Object.entries(resource.resource_information || {}).map(([key, value]) => (
                            <p key={key}>{key}: {value}</p>
                        ))}
                    </div>

                    <Separator className="my-4" />

                    <div>
                        <h3 className="text-lg font-semibold mb-2">图集</h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {resource.images.map((image, index) => (
                                <Dialog key={index}>
                                    <DialogTrigger asChild>
                                        <div className="relative w-[200px] h-[200px] cursor-pointer overflow-hidden">
                                            <Image
                                                src={image}
                                                alt={`${resource.name} - 图片 ${index + 1}`}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-lg"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity">
                                                <Eye className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                        <Image
                                            src={image}
                                            alt={`${resource.name} - 图片 ${index + 1}`}
                                            width={800}
                                            height={600}
                                            layout="responsive"
                                            objectFit="contain"
                                        />
                                    </DialogContent>
                                </Dialog>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
