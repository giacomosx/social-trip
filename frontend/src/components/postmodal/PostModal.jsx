import React, {useState} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {setPostModal, postModal} from "../../redux/postModalSlice";
import Button from "../button/Button";
import Label from "../label/Label";
import axiosApi from "../../api/axiosApi";
import Spinner from "../spinner/Spinner";

const PostModal = () => {
    const api = new axiosApi();
    const dispatch = useDispatch();
    const modalState = useSelector(postModal)
    const [content, setContent] = useState(null);
    const [tags, setTags] = useState([]);
    const [media, setMedia] = useState(null);
    const [success, setSuccess] = useState(false);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const handleClose = () => {
        dispatch(setPostModal(false))
        setContent(null)
        setMedia(null)
        setPreview(null)
        setTags(null)
    }

    const handleContent = (e) => {
        setContent(e.target.value);
    }
    const extractHashtags = async (string) => {

        const regex = /#\w+/g;
        const matches = await string.match(regex);
        const hashtags = matches ? matches : [];
        setTags(hashtags);
    }
    const handleFile = (e) => {

        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                setPreview(e.target.result);
                setMedia(file);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
            setMedia(null);
        }
    }
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            extractHashtags(content)
            setLoading(true);
            const formData = new FormData();
            formData.append("media", media);
            formData.append("content", content);
            if (tags && tags.length > 0) {
                formData.append("tags", tags)
            }
            const createPost = await api.post('/posts/create', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            if (createPost) {
                setSuccess(true)
            }

        } catch (e) {
            console.log(e)
            setError(true)
            if (e.response.data.error) {
                setResponse(e.response.data.error)
            }
            if (e.response.data.errors) {
                setError(true)
                setResponse('Something went wrong!')
            };
        } finally {
            setLoading(false)
        }
    }

    return (
        <div aria-hidden="true"
             className={`${modalState ? 'visible' : 'hidden'} fixed z-50 w-full top-0 left-0 h-full bg-black bg-opacity-80 `}>
            <div className="p-4 flex justify-center items-center h-full">
                <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 w-full sm:max-w-md">
                    <div
                        className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Create a new post
                        </h3>
                        <button onClick={handleClose}
                                type="button"
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-toggle="crud-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <form className="p-4 md:p-5 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {!preview ? (
                                <>
                                    <label htmlFor="dropzone-file"
                                           className="h-32 flex flex-col items-center justify-center rounded-lg border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                        <div className="flex flex-col items-center justify-center">
                                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                                 aria-hidden="true"
                                                 xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                      strokeWidth="2"
                                                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center"><span
                                            className="font-semibold">Click to upload</span> or
                                            drag and drop</p>
                                        <input id="dropzone-file" onChange={handleFile} type="file" className="hidden"
                                               accept="image/*" required/>
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX.
                                        800x400px)</p>
                                </>
                            ) : (
                                <img className="rounded-lg max-h-64 object-cover w-full overflow-hidden" src={preview}
                                     alt="Media preview"/>
                            )}
                        </div>
                        <div className="mb-4 space-y-4">
                            <div>
                                <Label htmlFor={'content'}>Content</Label>
                                <textarea rows="4"
                                          onChange={handleContent}
                                          name="content"
                                          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                          placeholder="Write your post content here"></textarea>
                            </div>
                        </div>
                        <Button variants={'rounded flex'} type={'submit'}>
                            {loading ? <Spinner/> : (
                                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                          clipRule="evenodd"></path>
                                </svg>
                            )}
                            <span>Add new post</span>
                        </Button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default PostModal;