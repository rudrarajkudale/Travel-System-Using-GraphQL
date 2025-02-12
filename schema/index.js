const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLID, GraphQLList } = require("graphql");
const Booking = require("../models/booking");

const BookingType = new GraphQLObjectType({
  name: "Booking",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    from: { type: GraphQLString },
    destination: { type: GraphQLString },
    date: { type: GraphQLString },
    time: { type: GraphQLString },
    price: { type: GraphQLInt },
    transportMode: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    bookings: {
      type: new GraphQLList(BookingType),
      resolve() {
        return Booking.find();
      },
    },
    booking: {
      type: BookingType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return Booking.findById(args.id);
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addBooking: {
      type: BookingType,
      args: {
        name: { type: GraphQLString },
        from: { type: GraphQLString },
        destination: { type: GraphQLString },
        date: { type: GraphQLString },
        time: { type: GraphQLString },
        price: { type: GraphQLInt },
        transportMode: { type: GraphQLString },
      },
      resolve(_, args) {
        let booking = new Booking({
          name: args.name,
          from: args.from,
          destination: args.destination,
          date: args.date,
          time: args.time,
          price: args.price,
          transportMode: args.transportMode,
        });
        return booking.save();
      },
    },
    deleteBooking: {
      type: BookingType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return Booking.findByIdAndDelete(args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
