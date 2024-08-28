import mongoose,{Schema} from "mongoose";

const listingSchema = new Schema(
    {
        name:{
            type:String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        address:{
            type: String,
            required: true
        },
        regularPrice:{
            type:Number,
            required: true
        },
        discountPrice:{
            type: String,
            required: true,
            validate:{
                validator: function(value) {
                    return value < this.regularPrice;
                },
                message: 'Discount price should be less than regular price.'
            }
        },
        furnished:{
            type:Boolean,
        },
        parking:{
            type:Boolean,
        },
        type:{
            type: String,
            required: true
        },
        offer:{
            type: Boolean,
        },
        bathrooms: {
            type: Number,
            required: true,
          },
        bedrooms: {
            type: Number,
            required: true,
        },
        imageUrls:{
            type: [String],
            required: true
        },
        userRef: {
            type: Schema.Types.ObjectId,
            ref: "User",
        }
    }, 
    {timestamps: true}
)


export const Listing = mongoose.model("Listing", listingSchema)